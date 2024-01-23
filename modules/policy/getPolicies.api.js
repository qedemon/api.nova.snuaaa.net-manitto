const {getPolicies} = require("./module");
const Result = require("modules/Utility/Result");

function attachGetPolicies(app){
    app.get("/getPolicies", async (req, res)=>{
        const {policies, error} = await getPolicies();
        if(error){
            res.json(
                {
                    result: Result.fail,
                    error: error.message
                }
            );
        }
        res.json(
            {
                result: Result.success,
                policies
            }
        )
    });
    return app;
}

module.exports = attachGetPolicies;