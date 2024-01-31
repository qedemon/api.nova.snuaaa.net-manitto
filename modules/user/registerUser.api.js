const authorize = require("modules/authorize/middleware");
const express = require("express");
const Result = require("modules/Utility/Result");
const {registerUser} = require("./module");
const getNow = require("modules/Utility/getNow");

function attachRegisterUser(app){
    app.use("/registerUser", authorize);
    app.use("/registerUser", express.json());
    app.post("/registerUser", async (req, res)=>{
        try{
            if(!(req.authorization?.authorized)){
                throw new Error("remote authorization failed.");
            }
            const userInfo = req.authorization.userInfo;
            userInfo.mission_difficulty = req.body.mission_rank;
            userInfo.enter_at = getNow();
            userInfo.exit_at = req.body.exit_at;
            const {user, error} = await registerUser(userInfo);
            if(error){
                throw error;
            }
            res.json(
                {
                    result: Result.success,
                    user
                }
            )
        }
        catch(error){
            res.json(
                {
                    result: Result.fail,
                    message: error.message,
                }
            )
        }
    });
    return app;
}

module.exports = attachRegisterUser;