const express = require("express");
const authorize = require("modules/authorize/middleware");
const Result = require("modules/Utility/Result");
const {autoConnect}= require("./module");

function attachRquestAutoConnect(app){
    app.use("/requestAutoConnect", authorize);
    app.use("/requestAutoConnect", express.json());
    app.post("/requestAutoConnect", async (req, res)=>{
        try{
            if(req.authorization?.userInfo.isAdmin!==true){
                throw new Error("unauthorized user");
            }
            const {command, data} = req.body;
            if(!command){
                throw new Error("invalid command");
            }
            if(!data){
                throw new Error("invalid data");
            }
            const {error, command: executed, data: newData} = await autoConnect(command, data);
            if(error){
                throw error;
            }
            res.json(
                {
                    result: Result.success,
                    command: executed,
                    data: newData
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

module.exports = attachRquestAutoConnect;