const express = require("express");
const middleware = express();

const attachRegisterUser = require("./registerUser.api");
const attachWhoAmI = require("./whoAmI.api");


attachRegisterUser(middleware);
attachWhoAmI(middleware);

middleware.get("/", (req, res)=>{
    res.writeHead(200, {"Content-type": "text/plain"});
    res.write("This is user module.");
    res.end();
})




module.exports = middleware;