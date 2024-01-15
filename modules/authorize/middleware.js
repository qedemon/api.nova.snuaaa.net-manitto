const authorize = require("./authorize");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use("/", cookieParser());
app.get("/", async (req, res)=>{
    const {token} = req.cookies;
    console.log(token);
    const {authorized, userInfo, error} = await authorize(token);
    if(authorized){
        res.json(
            {
                authorized,
                userInfo
            }
        )
    }
    else{
        res.json(
            {
                authorized,
                error
            }
        )
    }
})

module.exports = app;