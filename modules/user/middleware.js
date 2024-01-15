const express = require("express");
const middleware = express();

middleware.get("/", (req, res)=>{
    res.writeHead(200, {"Content-type": "text/plain"});
    res.write("This is user module.");
    res.end();
})

module.exports = middleware;