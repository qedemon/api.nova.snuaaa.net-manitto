const defineUser = require("./User");

module.exports = (sequelize, DataTypes)=>{
    const User = defineUser(sequelize, DataTypes);
    const Connection = sequelize.define("Connection", {
        follower_id: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "user_id"
            }
        },
        followee_id : {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "user_id"
            }
        },
        expired_at:{
            type: DataTypes.DATE
        }
    });
    
    User.belongsToMany(User, {through: Connection, as: "Followers", foreignKey: "followee_id"});
    User.belongsToMany(User, {through: Connection, as: "Followees", foreignKey: "follower_id"});
    

    return Connection;
}