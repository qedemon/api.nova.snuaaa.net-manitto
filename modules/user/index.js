const path = require("path");
const Module = require(path.join(__dirname, "module"));
const middleware = require(path.join(__dirname, "middleware"));

module.exports = async ()=>{
    console.log("user module is loaded.");
    return {
        module: Module,
        middleware
    };
}