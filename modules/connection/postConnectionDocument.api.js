const express = require("express");
const authorize = require("modules/authorize/middleware");
const Result = require("modules/Utility/Result");
const {setConnectionDocument}= require("./module");
const {sendPush} = require("modules/push/module");

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
            const {error, day:newDay, data: newData, updates, isCurrent} = await setConnectionDocument(day, data);
            
            const usersToUpdate = isCurrent?
                Array.from(
                    new Set(
                        [...updates.disconnected, ...updates.connected].map(({follower_id})=>follower_id)
                    )
                ):[];
            console.log("Push To: ", usersToUpdate);
            usersToUpdate.map(
                async (user_id)=>{
                    await sendPush(user_id, {
                        title: "AAA-Manitto",
                        body: "마니또가 바뀌었어요."
                    })
                }
            )
            
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