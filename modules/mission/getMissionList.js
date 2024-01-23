const defineModels = require("models");
const {createSequelize, closeSequelize} = require("modules/sequelize");

async function getMissionList(loadedSequelize = null){
    const sequelize = await(loadedSequelize?loadedSequelize:(await createSequelize()).sequelize);
    try{
        const DataTypes = sequelize.Sequelize.DataTypes;
        const {Mission} = defineModels(sequelize, DataTypes);
        const missions = 
        (
            await Mission.findAll(
                {
                    attributes: [
                        "id", "title", "difficulty", "description", "maximum",
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
            ({dataValues:{id, title, difficulty, description, maximum, n_users}})=>{
                return {
                    id, title, difficulty, description, maximum,
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