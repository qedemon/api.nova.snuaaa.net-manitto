const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");

async function setSchedule(user_id, schedule, loadedSequelize=null){
    const sequelize = (loadedSequelize || (await createSequelize()).sequelize);
    try{
        const {User, Schedule} = defineModels(sequelize, sequelize.Sequelize.DataTypes);
        const user = await findOne(
            {
                include: Schedule
            }
        );
        if(!user){
            throw new Error(`no user with user_id ${user_id}`)
        }
        return {

        }
    }
    catch(error){
        return {
            error
        };
    }
    finally{
        if(loadedSequelize===null){
            closeSequelize(sequelize);
        }
    }
}

module.exports = setSchedule;