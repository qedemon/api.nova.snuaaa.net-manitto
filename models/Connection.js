module.exports = (sequelize, DataTypes)=>{
    const Connection = sequelize.define("Connection", {
        expired_at:{
            type: DataTypes.DATE
        },
        isValid:{
            type: DataTypes.BOOLEAN,
            get(){
                return this.getDataValue("expired_at")===null
            }
        }
    });
    
    /*User.hasMany(Connection, {as: "Following", foreignKey: "follower_id"});
    Connection.belongsTo(User, {as: "Follower", foreignKey: "follower_id"});
    User.hasMany(Connection, {as: "Followed", foreignKey: "followee_id"});
    Connection.belongsTo(User, {as: "Followee", foreignKey: "followee_id"});

    Connection.User = User;*/

    return Connection;
}