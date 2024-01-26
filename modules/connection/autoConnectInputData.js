const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");
const {convertDateToUnit} = require("modules/Utility/convertDate");

async function autoConnectInputData(day, command="", loadedSequelize=null){
    const sequelize = (loadedSequelize || (await createSequelize()).sequelize);
    const Sequelize = sequelize.Sequelize;
    const {DataTypes, Op} = Sequelize;
    const {User, Schedule} = defineModels(sequelize, DataTypes);
    try{
        const users = await User.findAll(
            {
                where: {
                    isAdmin:{
                        [Op.not]: true
                    }
                },
                include:[
                    Schedule
                ]
            }
        );
        return {
            data: {
                users: users.map(
                    (user)=>{
                        const {user_id, name, col_no, major} = user;
                        const unitSchedule = (
                            ({enter_at, exit_at})=>{
                                return {
                                    enter_at: convertDateToUnit(new Date(enter_at)),
                                    exit_at: convertDateToUnit(new Date(exit_at))
                                }
                            }
                        )(user.Schedule)
                        return {
                            user_id, name, col_no, major,
                            schedule: unitSchedule
                        }
                    }
                ).filter(
                    ({schedule: {enter_at, exit_at}})=>{
                        return enter_at.major<=day && exit_at.major>=day;
                    }
                ),
                connections: [

                ],
                command,
                day
            }
        }
    }
    catch(error){
        return {
            error
        };
    }
    finally{
        if(loadedSequelize === null){
            await closeSequelize(sequelize);
        }
    }
}

module.exports = autoConnectInputData;