const executeAutoConnect = require("./executeAutoConnect");
const path = require("path");
const fs = require("fs");

test("executeAutoConnect", async()=>{
    const inputData = JSON.parse(fs.readFileSync(path.join(__dirname, "AAA_manito", "autoconnectInput.json")));
    const {error} = await executeAutoConnect(inputData);
    if(error){
        console.error(error);
        throw error;
    }
});