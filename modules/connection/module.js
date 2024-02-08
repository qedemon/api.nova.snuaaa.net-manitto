const connect = require("./connect");
const disconnect = require("./disconnect");
const getConnections = require("./getConnections");
const getConnectionDocumentAt = require("./getConnectionDocumentAt");
const getConnectionDocument = require("./getConnectionDocument");
const setConnectionDocument = require("./setConnectionDocument");
const autoConnect = require("./autoConnect");
const executeAutoConnect = require("./executeAutoConnect");

module.exports = {
    connect,
    disconnect,
    getConnections,
    getConnectionDocumentAt,
    getConnectionDocument,
    setConnectionDocument,
    autoConnect,
    executeAutoConnect
}