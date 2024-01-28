const express = require("express");
const middleware = express();

const attachRegisterUser = require("./registerUser.api");
const attachWhoAmI = require("./whoAmI.api");
const attachGetAllUser = require("./getAllUser.api")
const attachDeleteUser = require("./deleteUser.api");
const attachSetMission = require("./setMission.api");
const attachSetSchedule = require("./setSchedule.api");
const attachMakeMeAdmin = require("./makeMeAdmin.api");

attachRegisterUser(middleware);
attachWhoAmI(middleware);
attachGetAllUser(middleware);
attachDeleteUser(middleware);
attachSetMission(middleware);
attachSetSchedule(middleware);
attachMakeMeAdmin(middleware);

middleware.get("/", (req, res)=>{
    res.writeHead(200, {"Content-type": "text/plain"});
    res.write("This is user module.");
    res.end();
})




module.exports = middleware;