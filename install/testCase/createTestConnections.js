const {createSequelize, closeSequelize} = require("modules/sequelize");
const {convertDateToUnit, convertUnitToDate} = require("modules/Utility/convertDate");
const defineModels = require("models");
const {connect} = require("modules/connection/module");

async function createTestConnections(day, loadedSequelize=null){
    const sequelize = loadedSequelize || (await createSequelize()).sequelize;
    const Sequelize = sequelize.Sequelize;
    const {DataTypes, Op} = Sequelize;

    try{
        const {User, Schedule, Connection} = defineModels(sequelize, DataTypes);
        const users = (await User.findAll(
            {
                where: {
                    isAdmin: {
                        [Op.not]: true
                    }
                },
                include: [
                    Schedule
                ]
            }
        )).map(
            (user)=>{
                return {
                    ...user,
                    schedule: {
                        enter_at: convertDateToUnit(new Date(user.Schedule.enter_at)),
                        exit_at: convertDateToUnit(new Date(user.Schedule.exit_at))
                    }
                }
            }
        ).filter(
            ({schedule: {enter_at, exit_at}})=>{
                return enter_at.major<=day && exit_at.major>=day;
            }
        );

        const connectionInfo = (
            (users)=>{
                return users.map(
                    (_, index, users)=>{
                        if(index === users.length-1){
                            return {
                                follower: users[index],
                                followee: users[0]
                            }
                        }
                        else{
                            return {
                                follower: users[index],
                                followee: users[index+1]
                            }
                        }
                    }
                )
            }
        )(users);

        await connectionInfo.reduce(
            async (last, connectionInfo)=>{
                await last;
                const {follower, followee} = connectionInfo;
                const {connected, error} = await connect(follower.dataValues.user_id, followee.dataValues.user_id, sequelize);
                if(error){
                    throw error;
                }
            },
            Promise.resolve()
        )
        return {
            data: {
                users,
                connections: connectionInfo.map(
                    ({follower, followee})=>{
                        return {
                            follower_id: follower.dataValues.user_id,
                            followee: followee.dataValues.user_id
                        }
                    }
                )
            }
        }
    }
    catch(error){
        return {
            error
        }
    }
    finally{
        if(loadedSequelize === null){
            await closeSequelize(sequelize);
        }
    }
}

module.exports = createTestConnections;