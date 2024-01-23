const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModel = require("models");
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
        const Model = defineModel(sequelize, sequelize.Sequelize.DataTypes);
        const User = Model.User;
        const Schedule = Model.Schedule;
        const regiteredUser = await User.create(
            {
                user_id: user_info.user_id,
                name: user_info.name,
                id: user_info.id,
                col_no: user_info.col_no,
                major: user_info.major
            }
        );
        const mission_difficulty = user_info.mission_difficulty;
        await setMission(regiteredUser.user_id, mission_difficulty, sequelize);

        const schedule = await Schedule.create(
            {
                enter_at: user_info.enter_at,
                exit_at: user_info.exit_at
            }
        );
        await regiteredUser.setSchedule(schedule);
        
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