const authorize = require("./authorize");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use("/", cookieParser());
app.get("/", async (req, res)=>{
    const token = 
    (
        (match)=>{
            const prefix = match?match[0]:null;
            const index = match?.index;
            const input = match?.input;
            if(prefix)
                return input.substr(prefix.length+index);
            else
                return "";
        }
    )(req.headers.authorization?.match(/^bearer /i)) || req.cookies.token;

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