const connect = require("./connect");
const disconnect = require("./disconnect");
const getConnections = require("./getConnections");
const getConnectionDocument = require("./getConnectionDocument");
const setConnectionDocument = require("./setConnectionDocument");
const autoConnect = require("./autoConnect");
const executeAutoConnect = require("./executeAutoConnect");

module.exports = {
    connect,
    disconnect,
    getConnections,
    getConnectionDocument,
    setConnectionDocument,
    autoConnect,
    executeAutoConnect
}