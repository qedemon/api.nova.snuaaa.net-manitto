const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineUser = require("models/User");
const getUser = require("./getUser");
const Result = require("modules/Utility/Result");
const setMission = require("./setMission");

async function registerUser(user_info){
    const {sequelize} = await createSequelize();

    try{
        const {user} = await getUser({user_id: user_info.user_id});
        if(user){
            throw new Error("alread exists");
        }
        const User = defineUser(sequelize, sequelize.Sequelize.DataTypes);
        const regiteredUser = await User.create(
            {
                user_id: user_info.user_id,
                name: user_info.name,
                id: user_info.id,
                col_no: user_info.col_no,
                major: user_info.major,
            }
        );
        const mission_difficulty = user_info.mission_difficulty;
        await setMission(regiteredUser.user_id, mission_difficulty);
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