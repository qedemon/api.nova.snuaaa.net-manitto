const {createSequelize, closeSequelize} = require("modules/sequelize");
const getUser = require("./getUser");
const defineUser = require("models/User");
const Result = require("modules/Utility/Result");

async function registerUser(user_info){
    const {sequelize} = await createSequelize();
    const DataTypes = sequelize.Sequelize.DataTypes;
    const User = defineUser(sequelize, DataTypes);
    
    try{
        const {user} = await getUser({user_id: user_info.user_id});
        if(user){
            throw new Error("alread exists");
        }
        const regiteredUser = await User.create(user_info);
        return {
            result: Result.success,
            user: regiteredUser
        }
    }
    catch(error){
        return {
            result: Result.fail,
            error: error
        }
    }
    finally{
        closeSequelize(sequelize);
    }
}

module.exports = registerUser;