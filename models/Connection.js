module.exports = (sequelize, DataTypes)=>{
    const User = sequelize.define('User', {
        user_id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(16),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        col_no: {
            type: DataTypes.STRING(8)
        },
    });
    return User;
}