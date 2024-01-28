const {getVAPIDKey} = require("./module");
const authorize = require("modules/authorize/middleware");
const Result = require("modules/Utility/Result");

function attachGetVAPIDKey(app){
    app.use("/getVAPIDKey", authorize);
    app.get("/getVAPIDKey", (req, res)=>{
        try{
            if(!req.authorization?.authorized || !(req.authorization?.origin==="local")){
                throw new Error("unregistered user");
            }
            res.json(
                {
                    result: Result.success,
                    key: {
                        public: getVAPIDKey().public
                    }
                }
            )
        }
        catch(error){
            res.json(
                {
                    result: Result.fail,
                    error: error.message
                }
            )
        }
    })
}

module.exports = attachGetVAPIDKey;