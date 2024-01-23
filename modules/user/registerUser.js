const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModel = require("models");
const getUser = require("./getUser");

async function registerUser(user_info){
    const {sequelize} = await createSequelize();

    try{
        const Model = defineModel(sequelize, sequelize.Sequelize.DataTypes);
        const User = Model.User;
        const Mission = Model.Mission;
        const user = await User.findOne(
            {
                where:{
                    user_id: user_info.user_id
                }
            }
        );
        if(user){
            throw new Error("alread exists");
        }
        
        const mission_difficulty = user_info.mission_difficulty;
        const missions = await Mission.findAll(
            {
                where: {
                    difficulty: mission_difficulty
                }
            }
        );
        if(missions.length<=0){
            throw new Error(`there is no mission with the difficulty ${mission_difficulty}`);
        }
        const selected_mission = missions[
            (
                (min, max)=>{
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
                }
            )(0, missions.length)
        ];

        const regiteredUser = await User.create(
            {
                user_id: user_info.user_id,
                name: user_info.name,
                col_no: user_info.col_no,
                major: user_info.major,
                id: user_info.id,
                Schedule: {
                    enter_at: sequelize.Sequelize.fn("Now"),
                    exit_at: user_info.exit_at
                },
            },
            {
                include: [
                    User.Schedule
                ]
            }
        );
        try{
            await regiteredUser.setMission(selected_mission);
            const {user: reloadedUser, error} = await getUser({user_id: regiteredUser.user_id});
            if(error){
                throw error;
            }
            return {
                user: reloadedUser
            }
        }
        catch(error){
            await User.destroy(
                {
                    where: {
                        user_id: regiteredUser.user_id
                    }
                }
            );
            throw error;
        }
    }
    catch(error){
        return {
            error: error
        }
    }
    finally{
        closeSequelize(sequelize);
    }
}

module.exports = registerUser;