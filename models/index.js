const path = require("path");

module.exports = [
    {
        name: "User",
        model: require(path.join(__dirname, "User"))
    },
    {
        name: "Schedule",
        model: require(path.join(__dirname, "Schedule"))
    },
    {
        name: "Connection",
        model: require(path.join(__dirname, "Connection"))
    }
];