const {Sequelize} = require("sequelize");

async function closeSequelize(sequelize){
    return await sequelize.close();
}

module.exports = closeSequelize;