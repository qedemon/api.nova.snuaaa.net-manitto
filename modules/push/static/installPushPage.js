const host = "https://api.nova.snuaaa.net:9885/manitto/";

async function postSubscription(userInfo, subscription){
    const response = await fetch(`${host}push/registerPush`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
            {
                user_id: userInfo.user_id,
                subscription
            }
        ),
        credentials: "include"
    });
    return await response.json();
}

async function run(){
    try{
        if(!("serviceWorker" in navigator)){
            throw new Error("serviceWorker not impelemented")
        }
        const vapidKey = await (
            async()=>{
                const {result, error, key} = await (await fetch(`${host}push/getVAPIDKey`, {credentials: "include"})).json();
                if(result !==0){
                    throw error;
                }
                return key.public;
            }
        )();
        const userInfo = await (
            async()=>{
                const {result, error, origin, userInfo} = await (await fetch(`${host}user/whoami`, {credentials: "include"})).json();
                if(result !== 0){
                    throw error;
                }
                if(origin!=="local"){
                    throw new Error("unregisterd user");
                }
                return userInfo
            }
        )();
        /*const permission = await Notification.requestPermission();
        if(permission === "denied"){
            throw new Error("permission denied");
        }*/

        await navigator.serviceWorker.register("serviceworker.js");
        const registration = await navigator.serviceWorker.ready;
        const pushSubscription = await registration.pushManager.subscribe(
            {
                userVisibleOnly: true,
                applicationServerKey: vapidKey
            }
        );
        await (
            async()=>{
                const {result, error, user} = await postSubscription(userInfo, pushSubscription);
                if(result !== 0){
                    throw error;
                }
                console.log(user);
            }
        )()
    }
    catch(error){
        console.error(error);
        alert(error);
    }
    finally{
        //alert("돌아갑니다.");
        console.log("back");
        //history.back();
    }
}

run();