const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const routes = JSON.parse(fs.readFileSync(path.join(__dirname, "routes.json"), "utf-8"));

module.exports = async ()=>{
    const app = express();
    app.use(cors());
    await Promise.all(
        routes.map(
            async ({name, route})=>{
                try{
                    const loaded_module = await (require(route));
                    if(loaded_module.middleware){
                        app.use(`/${name}`, loaded_module.middleware);   
                    }
                }
                catch(error){
                    console.error(`An error occured during loading module ${name}`);
                    console.error(error);
                }
            }
        )
    )
    return app;
}