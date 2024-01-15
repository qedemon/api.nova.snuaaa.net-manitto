const {authenticate, createToken} = require("./module");
const express = require("express");

const app = express();
app.use("/", express.json());
app.post("/", async (req, res)=>{
    const {name, col_no, password} = req.body;
    const result = 
    await (
        async (name, col_no, password)=>{
            try{
                const {error, authenticated, user} = await authenticate(name, col_no, password);
                if(error)
                    throw error;
                const token = authenticated?createToken(user):null;
                return {authenticated, token};
            }
            catch(error){
                return {error};
            }
        }
    )(name, col_no, password);
    res.json(result);
});

app.get("/", (req, res)=>{
    res.writeHead(200, {"Content-type": "text/plain; utf-8"});
    res.write("This is authenticate module.");
    res.end();
});

module.exports = app;