const getPolicies = require("./getPolicies");

test("getPolicy", async ()=>{
    const {policies, error} = await getPolicies();
    if(error){
        throw error;
    }
});