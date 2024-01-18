const express = require("express");
const attachGetFollowee = require("./getFollowee.api");

const app = express();
attachGetFollowee(app);

module.exports = app;