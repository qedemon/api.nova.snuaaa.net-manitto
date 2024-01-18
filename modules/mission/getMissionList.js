const defineMission = require("models/Mission");
const {createSequelize, closeSequelize} = require("modules/sequelize");

async function getMissionList(loadedSequelize = null){
    const sequelize = await(loadedSequelize?loadedSequelize:(await createSequelize()).sequelize);
    try{
        const DataTypes = sequelize.Sequelize.DataTypes;
        const Mission = defineMission(sequelize, DataTypes);
        const missions = 
        (
            await Mission.findAll(
                {
                    attributes: [
                        "id", "title", "description", "maximum",
                        [sequelize.fn('COUNT', sequelize.col('User.user_id')), "n_users"]
                    ],
                    include: [
                        {
                            model: Mission.User,
                            attributes: []
                        }
                    ],
                    group: [sequelize.col('Mission.id')]
                }
            )
        ).map(
            ({dataValues:{id, title, description, maximum, n_users}})=>{
                return {
                    id, title, description, maximum,
                    n_users: Number(n_users)
                }
            }
        )
        return {
            missions: missions||[],
        }
    }
    catch(error){
        return {
            error
        }
    }
    finally{
        if(!loadedSequelize)
            await closeSequelize(sequelize);
    }
}

module.exports = getMissionList;