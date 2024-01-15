const defineUser = require("./User");

module.exports = (sequelize, DataTypes)=>{
    const User = defineUser(sequelize, DataTypes);
    const Schedule = sequelize.define('Schedule', {
        enter_at:{
            type: DataTypes.DATE,
            allowNull: true
        },
        exit_at:{
            type: DataTypes.DATE,
            allowNull: true
        }
    });
    return Schedule;
}