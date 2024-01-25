const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");

async function setSchedule(user_id, schedule, loadedSequelize=null){
    const sequelize = (loadedSequelize || (await createSequelize()).sequelize);
    try{
        const {User, Schedule} = defineModels(sequelize, sequelize.Sequelize.DataTypes);
        const user = await User.findOne(
            {
                where: {
                    user_id
                },
                include: Schedule
            }
        );
        if(!user){
            throw new Error(`no user with user_id ${user_id}`)
        }
        const newScheduleInfo = {
            enter_at: schedule?.enter_at||user.Schedule?.enter_at,
            exit_at: schedule?.exit_at||user.Schedule?.exit_at
        };
        const newSchedule = await Schedule.create(
            newScheduleInfo
        );
        await user.setSchedule(newSchedule);
        await user.reload();
        return {
            user:
            (
                ({user_id, name, col_no, major, Schedule:{enter_at, exit_at}})=>{
                    return {
                        user_id, name, col_no, major,
                        schedule: {
                            enter_at, exit_at
                        }
                    }
                }
            )(user)
        };
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