const {setMission} = require("./module");
const express = require("express");
const authorize = require("modules/authorize/middleware");
const Result = require("modules/Utility/Result");

function attachSetMission(app){
    app.use("/setMission", express.json());
    app.use("/setMission", authorize);
    app.post("/setMission", async (req, res)=>{
        const result = await (
            async ()=>{
                try{
                    const isAdmin = req?.authorization?.userInfo?.isAdmin;
                    if(!isAdmin){
                        throw new Error(`isAdmin : ${isAdmin}`);
                    }
                    const {user_id, mission_id} = req.body;
                    const {user, error} = await setMission(user_id, mission_id);
                    if(error){
                        throw error
                    }
                    return {
                        result: Result.success,
                        user
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

module.exports = attachSetMission;