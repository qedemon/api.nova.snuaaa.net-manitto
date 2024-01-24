const {getAllUser} = require("./module");
const authorize = require("modules/authorize/middleware");
const {midLayer: policy} = require("modules/policy/module");
const Result = require("modules/Utility/Result");

function attachGetAllUser(app){
    app.use("/getAllUser", authorize);
    app.use("/getAllUser", policy());
    app.get("/getAllUser", async (req, res)=>{
        const result = await (
            async ()=>{
                try{
                    const isAdmin = req.authorization?.userInfo?.isAdmin;
                    const policyValue = req.policy?.policies?.find(({name})=>name==="SHOW_FOLLOWER")?.value;
                    if(isAdmin || policyValue){
                        const {error, users} = await getAllUser();
                        if(error)
                            throw error;
                        return {
                            result: Result.success,
                            users
                        }
                    }
                    else{
                        throw new Error(`isAdmin: ${isAdmin}, SHOW_FOLLOWER: ${policyValue}`);
                    }
                }
                catch(error){
                    return {
                        result: Result.fail,
                        error: error.message
                    }
                }
            }
        )();
        res.json(result);
    })
    return app;
}

module.exports = attachGetAllUser;