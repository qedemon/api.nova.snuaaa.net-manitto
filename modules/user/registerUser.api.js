const authorize = require("modules/authorize/middleware");
const express = require("express");
const Result = require("modules/Utility/Result");
const {registerUser} = require("./module");

function attachRegisterUser(app){
    app.use("/registerUser", authorize);
    app.use("/registerUser", express.json());
    app.post("/registerUser", async (req, res)=>{
        try{
            if(!(req.authorization?.authorized)){
                throw new Error("remote authorization failed.");
            }
            const userInfo = req.authorization.userInfo;
            const {user, error, result} = await registerUser(userInfo);
            if(result===Result.fail){
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