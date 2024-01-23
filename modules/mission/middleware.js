const express = require("express");
const attachGetMissionList = require("./getMissionList.api");

const app = express();
attachGetMissionList(app);

module.exports = app;