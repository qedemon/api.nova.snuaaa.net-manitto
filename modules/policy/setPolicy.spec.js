const {getPolicies, setPolicy} = require("./module");

test("setPolicy", async ()=>{
    const {error} = await setPolicy("SHOW_FOLLOWER", true);
    if(error){
        throw error;
    }
    const {policies} = await getPolicies();
    const policy = policies.find(({name})=>name==="SHOW_FOLLOWER");
    if(!policy){
        throw new Error("no policy")
    }
    expect(policy.value).toBe(true);
    await setPolicy("SHOW_FOLLOWER", false);
});