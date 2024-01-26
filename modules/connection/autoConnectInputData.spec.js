const autoConnectInputData = require("./autoConnectInputData");
const fs = require("fs");
const path = require("path");

test("autoConnectInputData", async()=>{
    const index = 2;
    const {data, error} = await autoConnectInputData(index);
    await new Promise(
        (resolve, reject)=>{
            fs.writeFile(
                path.join("/home/api", "shared_files", `autoconnectInput${index}.json`), 
                JSON.stringify(data, null, '\t'), 
                (error)=>{
                    if(error)
                        reject(error);
                    resolve();
                }
            );
        }
    );
})