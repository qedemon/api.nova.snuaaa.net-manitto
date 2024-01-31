const express = require("express");
const authorize = require("modules/authorize/middleware");
const Result = require("modules/Utility/Result");
const {setConnectionDocument}= require("./module");

function attachPostConnectionDocument(app){
    app.use("/postConnectionDocument", authorize);
    app.use("/postConnectionDocument", express.json());
    app.post("/postConnectionDocument", async (req, res)=>{
        try{
            if(req.authorization?.userInfo.isAdmin!==true){
                throw new Error("unauthorized user");
            }
            const {day, data} = req.body;
            if(!data){
                throw new Error("invalid data");
            }
            const {error, day:newDay, data: newData, updates} = await setConnectionDocument(day, data);
            if(error){
                throw error;
            }
            res.json(
                {
                    result: Result.success,
                    day: newDay,
                    updates,
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

module.exports = attachPostConnectionDocument;