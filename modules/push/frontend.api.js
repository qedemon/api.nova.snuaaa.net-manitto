const express = require("express");
const path = require("path");


function attachFrontend(app){
    app.use("/frontend", express.static(path.join(__dirname, "static")));
    return app;
}

module.exports = attachFrontend;