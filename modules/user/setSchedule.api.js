const express = require("express");
const authroize = require("modules/authorize/middleware");
const {setSchedule} = require("./module");
const Result = require("modules/Utility/Result");

function attachSetSchedule(app){
    app.use("/setSchedule", authroize);
    app.use("/setSchedule", express.json());
    app.use("/setSchedule", async (req, res)=>{
        try{
            const {user_id, schedule} = req.body;
            const {user, error} = await setSchedule(user_id, schedule);
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
                    error: error.message
                }
            )
        }
    })
    return app;
}

module.exports=attachSetSchedule;