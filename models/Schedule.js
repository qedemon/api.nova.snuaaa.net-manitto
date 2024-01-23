module.exports = (sequelize, DataTypes)=>{
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
    /*User.hasOne(Schedule);
    Schedule.belongsTo(User);
    Schedule.User;*/
    return Schedule;
}