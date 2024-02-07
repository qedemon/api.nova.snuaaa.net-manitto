const { disconnect } = require("mongoose");
const getUser = require("./getUser");
const {getConnections} = require("modules/connection/module");

test("getUser", async ()=>{
    const userInfo = {
        id: "qedemon",
    };
    const {user, error} = await getUser(userInfo);
    if(error){
        console.error(error);
        throw error;
    }
    expect(user.id).toBe(userInfo.id);
    console.log(user);
    disconnect();
});