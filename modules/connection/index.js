const connectionModule = require("./module");
const middleware = require("./middleware");

module.exports = (
    async ()=>{
        console.log("")
        return {
            module: connectionModule,
            middleware
        }
    }
)();