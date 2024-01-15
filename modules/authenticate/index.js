const authenticateModule = require("./module");
const middleware = require("./middleware");

module.exports = async ()=>{
    console.log("authenticate module loaded.");
    return {
        module: authenticateModule,
        middleware
    }
}