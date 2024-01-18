const {getConnections} = require("./module");
const authorize = require("modules/authorize/middleware");
const Result = require("modules/Utility/Result");

function attachGetFollowee(app){
    app.use("/getFollowee", authorize);
    app.get("/getFollowee", (req, res)=>{
        const authorization = req.authorization;
        const target_user_id = authorization?.userInfo?.user_id;
        if(target_user_id){
            res.redirect(`getFollowee/${target_user_id}`);
        }
    })
    app.get("/getFollowee/:target_user_id", async (req, res)=>{
        const authorization = req.authorization;
        const target_user_id = Number(req.params.target_user_id);
        const result = await (
            async ()=>{
                try{
                    if(authorization?.origin !== "local"){
                        throw new Error("not registered.")
                    }
                    if(authorization.userInfo.isAdmin || (target_user_id===authorization.userInfo.user_id)){
                        const {connections, error} = await getConnections(target_user_id, null, true);
                        if(error){
                            throw error;
                        }
                        const trimedConnections = connections.map(
                            ({expired_at, Followee})=>{
                                return {expired_at, Followee};
                            }
                        );
                        const valid_connections = trimedConnections.filter(
                            ({expired_at})=>expired_at===null
                        );
                        const expired_connections = trimedConnections.filter(
                            ({expired_at})=>(expired_at!==null)
                        );
                        return {
                            result: Result.success,
                            target_user_id,
                            current_Connection: valid_connections.length>0?valid_connections[0]:null,
                            expired_connections,
                        }
                    }
                    else{
                        throw new Error(`unauthorized access`);
                    }
                }
                catch(error){
                    return {
                        result: Result.fail,
                        target_user_id,
                        error: error.message
                    }
                }
            }
        )();
        res.json(result);
    })
}

module.exports = attachGetFollowee;