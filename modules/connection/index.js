const connectionModule = require("./module");
const middleware = require("./middleware");

module.exports = (
    async ()=>{
        console.log("connecton module loaded.")
        return {
            module: connectionModule,
            middleware
        }
    }
)();