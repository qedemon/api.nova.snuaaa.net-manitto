const defineUser = require("./User");
const defineSchedule = require("./Schedule");
const defineConnection = require("./Connection");
const defineMission = require("./Mission");
const definePolicy = require("./Policy");

function defineModels(sequelize, DataTypes){
    const User = defineUser(sequelize, DataTypes);
    const Schedule = defineSchedule(sequelize, DataTypes);
    const Connection = defineConnection(sequelize, DataTypes);
    const Mission = defineMission(sequelize, DataTypes);
    const Policy = definePolicy(sequelize, DataTypes);

    if(!User.Schedule){
        User.hasOne(Schedule);
        User.Schedule = Schedule;
    }
    if(!Schedule.User){
        Schedule.belongsTo(User);
        Schedule.User = User;
    }

    if(!User.Connection){
        User.hasMany(Connection, {as: "Following", foreignKey: "follower_id"});
        User.hasMany(Connection, {as: "Followed", foreignKey: "followee_id"});
        User.Connection = Connection;
    }
    if(!Connection.User){
        Connection.belongsTo(User, {as: "Follower", foreignKey: "follower_id"});
        Connection.belongsTo(User, {as: "Followee", foreignKey: "followee_id"});
        Connection.User = User;
    }

    if(!Mission.User){
        Mission.hasOne(User);
        Mission.User = User;
    }
    if(!User.Mission){
        User.belongsTo(Mission);
        User.Mission = Mission;
    }

    return {
        User, Schedule, Connection, Mission, Policy
    };
}

module.exports = defineModels;