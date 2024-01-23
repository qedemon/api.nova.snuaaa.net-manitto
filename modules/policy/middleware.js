const express = require("express");
const attachGetPolicies = require("./getPolicies.api");
const attachSetPolicy = require("./setPolicy.api");

const app = express();
attachGetPolicies(app);
attachSetPolicy(app);

module.exports = app;
