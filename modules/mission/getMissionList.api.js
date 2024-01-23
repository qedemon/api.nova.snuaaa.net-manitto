const authorize = require("modules/authorize/middleware");
const Result = require("modules/Utility/Result");
const {getMissionList} = require("./module");

module.exports = (app)=>{
    app.use("/getMissionList", authorize);
    app.get("/getMissionList", async (req, res)=>{
        try{
            const authorization = req.authorization;
            if(!authorization?.authorized){
                throw new Error("unauthrized access");
            }
            const {error, missions} = await getMissionList();
            if(error){
                throw error
            }
            res.json(
                {
                    result: Result.success,
                    missions
                }
            )
        }
        catch(error){
            res.json(
                {
                    result: Result.fail,
                    message: error.message
                }
            )
        }
    })
    return app;
}