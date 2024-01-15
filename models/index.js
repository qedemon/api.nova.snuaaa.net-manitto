const path = require("path");

module.exports = [
    {
        name: "User",
        model: require(path.join(__dirname, "User"))
    }
];