const createTestConnections = require("./createTestConnections");

test("createTestConnections", async()=>{
    const {data, error} = await createTestConnections(0);
    if(error){
        console.error(error);
    }
})