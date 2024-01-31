const validateConnection = require("./validateConnection");

test("validateConnection", async()=>{
    const {error, toBeConnected} = await validateConnection(null);
    console.log(toBeConnected);
    if(error){
        console.error(error);
    }
})