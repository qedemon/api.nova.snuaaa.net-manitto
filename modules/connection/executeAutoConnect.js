require("dotenv").config();
const spawn = require("child_process").spawn;
const path = require("path");
const fs = require("fs");

async function executeAutoConnect(data){
    try{
        const dataStr = JSON.stringify(data, {}, "\t");
        const {stdout, stderr} = await (
            new Promise(
                (resolve)=>{
                    const child = spawn("python3", [path.join(__dirname, "AAA_manito", "main.py")]);
                    child.stdin.setEncoding('utf-8');
                    let output = "";
                    let error = "";
                    child.on("exit", ()=>{
                        resolve({stdout: output, stderr: error});
                    });
                    child.stdout.on("data", (data)=>{
                        output=output+data;
                    });
                    child.stderr.on("data", (data)=>{
                        error=error+data;
                    })
                    child.stdin.write(dataStr+"\n");
                    child.stdin.end();
                }
            )
        );
        if(stderr.length>0){
            throw new Error(stderr);
        }
        const rawData = JSON.parse(stdout);
        fs.writeFileSync(path.join(process.env.SHARED_FILES, "autoConenctInput.json"), dataStr);
        fs.writeFileSync(path.join(process.env.SHARED_FILES, "autoConenctOutput.json"), stdout);
        return {
            data: {
                connections: [
                    rawData.connections0,
                    rawData.connections1,
                    rawData.connections2,
                ]
            }
        }
    }
    catch(error){
        return {
            error
        }
    }
}

module.exports = executeAutoConnect;