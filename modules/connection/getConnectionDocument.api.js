const express = require("express");
const authorize = require("modules/authorize/middleware");
const Result = require("modules/Utility/Result");
const {getConnectionDocument} = require("./module");

function attachGetConnectionDocument(app){
    app.use("/getConnectionDocument", express.json());
    app.use("/getConnectionDocument", authorize);
    app.get("/getConnectionDocument/:day", async (req, res)=>{
        try{
            if(!req.authorization?.userInfo?.isAdmin){
                throw new Error(`unauthorized user ${req.authorization?.userInfo?.name}`);
            }
            const {data, error} = await getConnectionDocument(req.params.day);
            if(error){
                throw error
            }
            res.json(
                {
                    result: Result.success,
                    data
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

module.exports = attachGetConnectionDocument;