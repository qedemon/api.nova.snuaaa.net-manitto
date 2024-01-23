const getUser = require("./getUser");
const {getConnections} = require("modules/connection/module");

test("getUser", async ()=>{
    const userInfo = {
        id: "testA",
    };
    const {user, error} = await getUser(userInfo);
    if(error){
        console.error(error);
        throw error;
    }
    console.log(user);
    expect(user.id).toBe(userInfo.id);
});