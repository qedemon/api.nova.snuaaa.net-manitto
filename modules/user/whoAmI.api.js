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
            const {user, error} = await getUser({user_id: req.authorization.userInfo.user_id});
            if(error)
                throw error;
            if(user){
                res.json(
                    {
                        result: Result.success,
                        user,
                        origin: "local"
                    }
                )
            }
            else{
                const {user_id, id, username: name, col_no} = req.authorization.userInfo;
                res.json(
                    {
                        result: Result.success,
                        user: {
                            user_id,
                            id,
                            name,
                            col_no,
                            isAdmin: false
                        },
                        origin: "remote"
                    }
                )
            }
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