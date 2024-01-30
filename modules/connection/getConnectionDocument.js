const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModel = require("models");
const {convertDateToUnit, convertUnitToDate} = require("modules/Utility/convertDate");
const getNow = require("modules/Utility/getNow");
const getConnectionGroups = require("modules/Utility/connectionGroups");

async function getConnectionDocument(day, loadedSequelize=null, today=convertDateToUnit(getNow()).major){
    const sequelize = loadedSequelize || (await createSequelize()).sequelize;
    const Sequelize = sequelize.Sequelize;
    const {DataTypes, Op} = Sequelize;
    try{
        const {User, Connection, Schedule} = defineModel(sequelize, DataTypes);
        const [disconnected, connectedUsers] = (await User.findAll(
            {
                where: {
                    isAdmin: false
                },
                include: [
                    {
                        model: Connection,
                        as: "Following"
                    },
                    {
                        model: Connection,
                        as: "Followed"
                    },
                    Schedule
                ]
            }
        ))
        .map(
            (user)=>{
                user.schedule= (
                    (Schedule)=>{
                        return !Schedule?null:
                        {
                            enter_at: convertDateToUnit(new Date(Schedule.enter_at)),
                            exit_at: convertDateToUnit(new Date(Schedule.exit_at))
                        }
                    }
                )(user.Schedule);
                return user;
            }
        )
        .filter(
            ({schedule})=>{
                return schedule && (
                    ({enter_at, exit_at})=>{
                        return (enter_at.major<=day && day<=exit_at.major) && (enter_at.major<=today)
                    }
                )(schedule)
            }
        )
        .reduce(
            ([disconnected, connected], user)=>{
                const {Following, Followed} = user;
                const isDisconnected =  [Following, Followed].every(
                    (connections)=>{
                        return connections.filter(
                            (connectionInfo)=>{
                                const connection = Connection.build(connectionInfo);
                                const {isValid, willBeValid} = connection;
                                return !isValid && (willBeValid!==day) && !(convertDateToUnit(connection.expired_at).day>day);
                            }
                        ).length === 0;
                    }
                );
                return isDisconnected?
                    [[...disconnected, user], connected]:
                    [disconnected, [...connected, user]]
            },
            [[], []]
        );

        const connections = connectedUsers.map(
            ({Following})=>{
                const validFollowing = (
                    (connections)=>{
                        const willBeValid = connections.find(({willBeValid})=>willBeValid===day);
                        if(willBeValid){
                            return willBeValid;
                        }
                        const isValid = connections.find(({isValid})=>isValid);
                        if(isValid){
                            return isValid;
                        }
                        return connections.sort(
                            (a, b)=>{
                                const A = new Date(a.expired_at);
                                const B = new Date(b.expired_at);
                                if(B>A){
                                    return -1;
                                }
                                if(A>B){
                                    return 1;
                                }
                                return 0;
                            }
                        )[0];
                    }
                )(Following.map(connectionInfo=>Connection.build(connectionInfo.dataValues)));
                const {follower_id, followee_id} = validFollowing;
                return {
                    follower_id, followee_id
                }
            }
        );
        
        const connectionGroups = getConnectionGroups(connections);

        return {
            data: {
                disconnected: disconnected.map(
                    ({user_id, col_no, major, name, schedule})=>{
                        return {user_id, col_no, major, name, schedule};
                    }
                ),
                connected: connectedUsers.map(
                    ({user_id, col_no, major, name, schedule})=>{
                        return {user_id, col_no, major, name, schedule};
                    }
                ),
                connectionGroups
            }
        }
    }
    catch(error){
        console.error(error);
        return {
            error
        }
    }
    finally{
        if(loadedSequelize===null){
            await closeSequelize(sequelize);
        }
    }
}

module.exports = getConnectionDocument;