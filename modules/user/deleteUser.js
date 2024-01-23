const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");

async function deleteUser(user_id, loadedSequelize=null){
    const {sequelize} = await (loadedSequelize || createSequelize());
    try{
        const {User} = defineModels(sequelize, sequelize.Sequelize.DataTypes);
        const destroyed = await User.destroy(
            {
                where: {
                    user_id: user_id
                }
            }
        );
        if(destroyed<=0){
            throw new Error(`nobody with user_id = ${user_id}`);
        }
        return {
            destroyed
        }
    }
    catch(error){
        return {
            error
        }
    }
    finally{
        if(loadedSequelize === null){
            closeSequelize(sequelize);
        }
    }
}

module.exports = deleteUser;