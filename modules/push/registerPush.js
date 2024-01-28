const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");

async function registerPush(user_id, subscription, loadedSequelize = null){
    const sequelize = loadedSequelize || (await createSequelize()).sequelize;
    const Sequelize = sequelize.Sequelize;
    const {DataTypes} = Sequelize;
    const {User, Push} = defineModels(sequelize, DataTypes);
    try{
        const user = await User.findOne(
            {
                where: {
                    user_id
                }
            }
        );
        if(!user){
            throw new Error("unregistred user");
        }
        const push = await Push.create(
            {
                subscription: JSON.stringify(subscription)
            }
        );
        await user.setPush(push);
        await user.reload(
            {
                include: [Push]
            }
        )
        return {
            user
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

module.exports = registerPush;