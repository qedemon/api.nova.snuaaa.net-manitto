const getAllUser = require("./getAllUser");

test("getAllUser", async()=>{
    const {error, users} = await getAllUser();
    if(error){
        throw error;
    }
    //console.log(JSON.stringify(users, null, "\t"));
});