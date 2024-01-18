const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineMission = require("models/Mission");
const {getMissionList} = require("modules/mission/module")

async function setMission(user_id, mission_id){
    const {sequelize} = await createSequelize();
    const DataTypes = sequelize.Sequelize.DataTypes;
    try{
        const {error, missions} = await getMissionList(sequelize);
        if(error){
            throw error;
        }
        if(missions.length<=0){
            throw new Error("no missions");
        }
        const targetMissionInfo = missions.find(({id})=>id===mission_id);
        if(!targetMissionInfo){
            throw new Error("invalid target mission");
        }
        if(targetMissionInfo.no_user>=targetMissionInfo.maximum){
            throw new Error("full mission");
        }
        const Mission = defineMission(sequelize, DataTypes);
        const targetMission = await Mission.findOne(
            {
                where: {
                    id: mission_id
                }
            }
        );
        const User = Mission.User;
        const user = await User.findOne({where: {user_id}});
        if(!user){
            throw new Error("invalid user");
        }
        const result = await user.setMission(targetMission);
        return {
            user_id: result.user_id, mission_id: result.MissionId
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

module.exports = setMission;