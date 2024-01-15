require("dotenv").config();
const http = require("http");
const app = require("./routes");
app().then(
    (app)=>{
        http.createServer(app).listen(process.env.HTTP_PORT, ()=>{
            console.log(`http server listen at ${process.env.HTTP_PORT}`);
        })
    }
)