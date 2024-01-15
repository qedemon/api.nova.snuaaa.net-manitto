const path = require("path");
const createSequelize = require(path.join(__dirname, "createSequelize"));
const closeSequelize = require(path.join(__dirname, "closeSequelize"));

module.exports={
    createSequelize,
    closeSequelize
};