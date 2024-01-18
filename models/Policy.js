function Policy(sequelize, DataTypes){
    const Policy = sequelize.define("Policy", {
        variable: {
            type: DataTypes.STRING(64)
        },
        value: {
            type: DataTypes.TEXT,
            defaultValue: JSON.stringify({})
        }
    });
    return Policy;
}

module.exports = Policy;