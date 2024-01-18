const middleware = require("./middleware");
const missionModule = require("./module")

module.exports = (
    async ()=>{
        console.log("mission module loaded.");
        return {
            module: missionModule,
            middleware
        }
    }
)();