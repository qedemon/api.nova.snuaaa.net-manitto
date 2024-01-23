const middleware = require("./middleware");
const missionModule = require("./module")

module.exports = (
    async ()=>{
        console.log("policy module loaded.");
        return {
            module: missionModule,
            middleware
        }
    }
)();