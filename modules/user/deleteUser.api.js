const {deleteUser} = require("./module");
const express = require("express");
const Result = require("modules/Utility/Result");

function attachDeleteUser(app){
    app.use("/deleteUser", express.json());
    app.post("/deleteUser", async (req, res)=>{
        const result = await (
            async ()=>{
                try{
                    const {user_id: targetUser} = req.body;
                    const {destroyed, error} = await deleteUser(targetUser);
                    if(error){
                        throw error;
                    }
                    return {
                        result: Result.success,
                        deleted: destroyed
                    }
                }
                catch(error){
                    return {
                        result: Result.fail,
                        message: error.message
                    }
                }
            }
        )();
        res.json(result);
    });
}

module.exports = attachDeleteUser;