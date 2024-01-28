const middleware = require("./middleware");
const pushModule = require("./module")

module.exports = (
    async ()=>{
        console.log("push module loaded.");
        return {
            module: pushModule,
            middleware
        }
    }
)();