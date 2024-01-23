const express = require("express");
const attachGetPolicies = require("./getPolicies.api");

const app = express();
attachGetPolicies(app);

module.exports = app;
