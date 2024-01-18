const {getUser} = require("./module");
const authorize = require("modules/authorize/middleware");
const Result = require("modules/Utility/Result");

function attachWhoAmI(app){
    app.use("/whoami", authorize);
    app.get("/whoami", async (req, res)=>{
        try{
            if(!req.authorization?.authorized){
                throw new Error("unauthorized");
            }
            res.json(
                {
                    result: Result.success,
                    userInfo: req.authorization.userInfo,
                    origin: req.authorization.origin
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
    });
}

module.exports = attachWhoAmI;