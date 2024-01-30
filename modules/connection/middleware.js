const express = require("express");
const attachGetConnectionDocument = require("./getConnectionDocument.api");
const attachPostConnectionDocument = require("./postConnectionDocument.api");
const attachRquestAutoConnect = require("./requestAutoConnect.api");
const app = express();
attachGetConnectionDocument(app);
attachPostConnectionDocument(app);
attachRquestAutoConnect(app);

module.exports = app;