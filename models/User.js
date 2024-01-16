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
        id:{
            type: DataTypes.STRING(16),
            allowNull: false,
            primaryKey: false
        },
        col_no: {
            type: DataTypes.STRING(8)
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
    return User;
}