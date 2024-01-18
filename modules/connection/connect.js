const {createSequelize, cloaseSeqeulize} = require("modules/sequelize");
const defineConnection = require("models/Connection");

async function connect(follower_id, followee_id){
    const {sequelize} = await createSequelize();
    const DataTypes = sequelize.Sequelize.DataTypes;

    
    cloaseSeqeulize(sequelize);
}