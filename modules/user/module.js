const registerUser = require("./registerUser");
const getUser = require("./getUser");
const getAllUser = require("./getAllUser");
const deleteUser = require("./deleteUser");
const setMission = require("./setMission");
const setSchedule = require("./setSchedule");
const makeUserAdmin = require("./makeUserAdmin");

module.exports = {
    registerUser,
    getUser,
    getAllUser,
    deleteUser,
    setMission,
    setSchedule,
    makeUserAdmin
}