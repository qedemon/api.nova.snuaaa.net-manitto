const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineUser = require("models/User");

async function createUser({name, password, col_no}){
    const {sequelize} = await createSequelize();
    const User = defineUser(sequelize, sequelize.Sequelize.DataTypes);
    try{
        const user = await User.create({
            name, password, col_no
        });
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
        await closeSequelize(sequelize);
    }
}

module.exports = createUser;