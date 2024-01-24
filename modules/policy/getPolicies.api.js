const {midLayer} = require("./module");
const Result = require("modules/Utility/Result");

function attachGetPolicies(app){
    app.use("/getPolicies", midLayer());
    app.get("/getPolicies", async (req, res)=>{
        const {policies, error} = req.policies
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