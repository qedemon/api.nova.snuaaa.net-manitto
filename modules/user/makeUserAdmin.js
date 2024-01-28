const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");

async function makeUserAdmin(user_id, isAdmin, loadedSequelize=null){
    const sequelize = loadedSequelize || (await createSequelize()).sequelize;
    const Sequelize = sequelize.Sequelize;
    try{
        const {User} = defineModels(sequelize, Sequelize.DataTypes);
        const [updated] = await User.update(
            {
                isAdmin
            },
            {
                where:{
                    user_id
                }
            }
        );
        if(updated<1){
            new Error(`invalid user_id${user_id}`)
        }
        return {
            updated
        }
    }
    catch(error){
        return {
            error
        }
    }
    finally{
        if(loadedSequelize===null){
            closeSequelize(sequelize);
        }
    }
}

module.exports=makeUserAdmin;