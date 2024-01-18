const defineUser = require("./User");

function defineMission(sequelize, DataTypes){
    const User = defineUser(sequelize, DataTypes);
    const Mission = sequelize.define("Mission", {
        title: DataTypes.STRING(64),
        description: DataTypes.TEXT,
        maximum: DataTypes.INTEGER,
        difficulty: DataTypes.INTEGER
    });
    Mission.hasOne(User);
    User.belongsTo(Mission);
    Mission.User = User;
    return Mission;
}

module.exports = defineMission;