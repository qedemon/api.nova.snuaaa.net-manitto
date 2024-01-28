function definePush(sequelize, DataTypes){
    const Push = sequelize.define("Push", {
        subscription: DataTypes.TEXT
    });
    return Push;
}

module.exports = definePush;