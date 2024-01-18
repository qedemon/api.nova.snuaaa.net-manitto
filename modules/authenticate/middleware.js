const {authenticate} = require("./module");
const express = require("express");

const app = express();
app.use("/", express.json());
app.post("/", async (req, res)=>{
    const {id, password} = req.body;
    const result = await (async (id, password)=>{
        const {authenticated, userInfo, token, error} = await authenticate(id, password);
        if(authenticated){
            return {
                authenticated,
                userInfo,
                token
            }
        }
        else{
            return {
                authenticated,
                error
            }
        }
    })(id, password);

    if(result.token)
        res.append("Set-Cookie", `token=${result.token}; Path=/;`);
    res.json(result);
});

app.get("/", (req, res)=>{
    res.writeHead(200, {"Content-type": "text/plain; utf-8"});
    res.write("This is authenticate module.");
    res.end();
});

module.exports = app;