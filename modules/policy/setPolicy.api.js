const express = require("express");
const authorize = require("modules/authorize/middleware");
const {setPolicy} = require("./module");
const Result = require("modules/Utility/Result");

function attachSetPolicy(app){
    app.use("/setPolicy", express.json());
    app.use("/setPolicy", authorize);
    app.post("/setPolicy", async (req, res)=>{
        try{
            if(!req.authorization?.userInfo?.isAdmin){
                throw new Error(`unauthorized user ${req.authorization?.userInfo?.name}`);
            }
            const requiredPolicies = req.body;
            const {error, policies} = setPolicy(requiredPolicies);
            if(error)
                throw error;
            res.json(
                {
                    result: Result.success,
                    policy: policies
                }
            )
        }
        catch(error){
            res.json({
                result: Result.fail,
                error: error.message
            });
        }
    });
    return app;
}

module.exports = attachSetPolicy;