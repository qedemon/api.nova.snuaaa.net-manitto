const defineUser = require("./User");

module.exports = (sequelize, DataTypes)=>{
    const User = defineUser(sequelize, DataTypes);
    const Connection = sequelize.define("Connection", {
        expired_at:{
            type: DataTypes.DATE
        }
    });
    
    User.hasMany(Connection, {as: "Following", foreignKey: "follower_id"});
    Connection.belongsTo(User, {as: "Follower", foreignKey: "follower_id"});
    User.hasMany(Connection, {as: "Followed", foreignKey: "followee_id"});
    Connection.belongsTo(User, {as: "Followee", foreignKey: "followee_id"});

    Connection.User = User;

    return Connection;
}