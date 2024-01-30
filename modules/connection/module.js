const connect = require("./connect");
const disconnect = require("./disconnect");
const getConnectionDocument = require("./getConnectionDocument");
const setConnectionDocument = require("./setConnectionDocument");
const autoConnect = require("./autoConnect");
const executeAutoConnect = require("./executeAutoConnect");

module.exports = {
    connect,
    disconnect,
    getConnectionDocument,
    setConnectionDocument,
    autoConnect,
    executeAutoConnect
}