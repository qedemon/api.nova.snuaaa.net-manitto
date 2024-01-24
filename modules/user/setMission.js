const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModel = require("models");

async function setMission(user_id, mission_id, loaded_sequelize=null){
    const sequelize = loaded_sequelize || (await createSequelize()).sequelize;

    try{
        const Model = defineModel(sequelize, sequelize.Sequelize.DataTypes);
        const User = Model.User;
        const Mission = Model.Mission;
        const user = await User.findOne(
            {
                where:{
                    user_id: user_id
                }
            }
        );
        if(!user){
            throw new Error(`no user with user_id ${user_id}`);
        }
        const mission = await Mission.findOne(
            {
                where: {
                    id: mission_id
                }
            }
        );
        if(!mission){
            throw new Error(`no mission with mission_id ${mission_id}`);
        }
        await user.setMission(mission);
        await user.reload(
            {
                include: {
                    model: Mission,
                }
            }
        );
        return {
            user: {
                ...(
                    ({user_id, name, col_no, major})=>{
                        return {
                            user_id, name, col_no, major
                        };
                    }
                )(user),
                mission: (
                    ({id, title, description, difficulty})=>{
                        return {
                            mission_id: id, title, description, difficulty
                        }
                    }
                )(user.Mission)
            }
        }
    }
    catch(error){
        return {
            error: error
        }
    }
    finally{
        if(loaded_sequelize===null)
            closeSequelize(sequelize);
    }
}

module.exports = setMission;