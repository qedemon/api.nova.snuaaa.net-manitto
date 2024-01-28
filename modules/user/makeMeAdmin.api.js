const {makeUserAdmin} = require("./module");
const authorize = require("modules/authorize/middleware");
const express = require("express");
const Result = require("modules/Utility/Result");

function attachMakeMeAdmin(app){
    app.use("/makeMeAdmin", authorize);
    app.use("/makeMeAdmin", express.json());
    app.post("/makeMeAdmin", async (req, res)=>{
        try{
            const {isAdmin} = req.body;
            const user_id = req.authorization?.userInfo.user_id;
            if(!user_id){
                throw new Error("unauthorized");
            }
            const {error} = await makeUserAdmin(user_id, isAdmin);
            if(error){
                throw error;
            }
            res.json({
                result: Result.success
            });
        }
        catch(error){
            res.json(
                {
                    result: Result.fail,
                    error: error.message
                }
            )   
        }
    });
    return app;
}

module.exports = attachMakeMeAdmin;