const {registerPush, sendPush} = require("./module");
const authorize = require("modules/authorize/middleware");
const express = require("express");
const Result = require("modules/Utility/Result");

function attachRegisterPush(app){
    app.use("/registerPush", authorize);
    app.use("/registerPush", express.json());
    app.post("/registerPush", async (req, res)=>{
        const {user_info, authorized} = req.authorization;
        try{
            if(!authorized){
                console.log(req.authorization);
                throw new Error("unregisterd user");
            }
            const subscription = req.body.subscription;
            const user_id = req.body.user_id;
            const {error, user} = await registerPush(user_id, subscription);
            if(error){
                throw error;
            }
            res.json(
                {
                    result: Result.success,
                    user: {
                        user_id: user.user_id,
                        subscription: user.Push.subscription
                    }
                }
            );
            await sendPush(user_id, {
                title: "AAA-Manitto",
                body: "마니또가 바뀌면 알려드릴게요."
            })
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

module.exports = attachRegisterPush