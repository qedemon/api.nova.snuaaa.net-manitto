const authorizeModule = require("./module");
const middleware = require("./middleware");

module.exports = async ()=>{
    console.log("authorize module loaded.");
    return {
        module: authorizeModule,
        middleware
    }
}