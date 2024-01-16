const {createSequelize, closeSequelize} = require("modules/sequelize");
const getUser = require("./getUser");
const defineUser = require("models/User");
const Result = require("modules/Utility/Result");

async function registerUser(user_info){
    const {sequelize} = await createSequelize();
    const DataTypes = sequelize.Sequelize.DataTypes;
    const User = defineUser(sequelize, DataTypes);
    
    const {user_id, id, username: name, col_no} = user_info;
    try{
        const {user} = await getUser({user_id});
        if(user){
            throw new Error("alread exists");
        }
        const regiteredUser = await User.create({
            user_id, id, name, col_no
        });
        return {
            result: Result.success,
            user: (
                ({user_id, id, name, col_no})=>{
                    return {
                        user_id,
                        id,
                        name,
                        col_no,
                    }
                }
            )(regiteredUser)
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