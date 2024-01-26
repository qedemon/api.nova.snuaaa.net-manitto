const express = require("express");
const attachGetConnectionDocument = require("./getConnectionDocument.api");
const app = express();
attachGetConnectionDocument(app);

module.exports = app;