const {createSequelize, closeSequelize} = require("modules/sequelize");
const {getMissionList} = require("modules/mission/module");
const defineModels = require("models");

async function setMission(user_id, difficulty, loadedSequelize=null){
    const sequelize = (loadedSequelize || (await createSequelize()).sequelize);
    const DataTypes = sequelize.Sequelize.DataTypes;
    try{
        const {error, missions} = await getMissionList(sequelize);
        if(error){
            throw error;
        }
        if(missions.length<=0){
            throw new Error("no missions");
        }
        const mission_with_difficulty = missions.filter(
            (
                (target)=>({difficulty})=>{
                    return target===difficulty
                }
            )(difficulty)
        ).map(
            (item)=>{
                const remain = item.maximum-item.no_user;
                return {...item, remain};
            }
        ).sort(
            (a, b)=>{
                return b.remain-a.remain;
            }
        );
        const remain = mission_with_difficulty.reduce((result, {remain})=>result+remain, 0);
        if(mission_with_difficulty.length===0){
            throw new Error("invalid difficulty");
        }
        if(remain<=0){
            throw new Error("full mission");
        }
        const targetMissionInfo = mission_with_difficulty[0];


        const {Mission} = defineModels(sequelize, DataTypes);
        const targetMission = await Mission.findOne(
            {
                where: {
                    id: targetMissionInfo.id
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
        if(loadedSequelize===null)
            await closeSequelize(sequelize);
    }
}

module.exports = setMission;