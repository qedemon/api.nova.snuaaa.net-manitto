const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineUser = require("models/User");

async function getUser(condition){
    const {sequelize} = await createSequelize();
    const User = defineUser(sequelize, sequelize.Sequelize.DataTypes);
    try{
        const user = await User.findOne(
            {
                where: condition
            }
        )
        return {user};
    }
    catch(error){
        return {error};
    }
    finally{
        await closeSequelize(sequelize);
    }
}

module.exports = getUser;