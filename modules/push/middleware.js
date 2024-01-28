const express = require("express");

const attachFrontend = require("./frontend.api");
const attachGetVAPIDKey = require("./getGetVAPIDKey.api");
const attachRegisterPush = require("./registerPush.api")

const app = express();
attachFrontend(app);
attachGetVAPIDKey(app);
attachRegisterPush(app);

module.exports = app;