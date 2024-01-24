const express = require("express");
const getPolicies = require("./getPolicies");

function midLayer(){
    const app = express();
    app.use("/", async (req, _, next)=>{
        const {policies, error} = await getPolicies();
        if(error){
            req.policy={error};
        }
        else{
            req.policy={policies};
        }
        next();
    })
    return app;
}


module.exports = midLayer;