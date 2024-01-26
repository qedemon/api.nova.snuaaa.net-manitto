const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModel = require("models");
const {convertDateToUnit, convertUnitToDate} = require("modules/Utility/convertDate");

async function getConnectionDocument(day, loadedSequelize){
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
        .reduce(
            ([disconnected, connected], user)=>{
                const {Following, Followed} = user;
                const isDisconnected =  [Following, Followed].every(
                    (connections)=>{
                        return connections.filter(
                            ({expired_at})=>{
                                return expired_at===null;
                            }
                        ).length === 0;
                    }
                );
                return isDisconnected?
                    [[...disconnected, user], connected]:
                    [disconnected, [...connected, user]]
            },
            [[], []]
        )
        .map(
            (users)=>{
                return users
                .map(
                    (user)=>{
                        const {user_id, col_no, major, name, Following, Followed} = user;
                        return {
                            user_id, col_no, major, name,
                            Following, Followed,
                            schedule: (
                                (Schedule)=>{
                                    return !Schedule?null:
                                    {
                                        enter_at: convertDateToUnit(new Date(Schedule.enter_at)),
                                        exit_at: convertDateToUnit(new Date(Schedule.exit_at))
                                    }
                                }
                            )(user.Schedule)
                        }
                    }
                )
                .filter(
                    ({schedule})=>{
                        return schedule && (
                            ({enter_at, exit_at})=>{
                                return enter_at.major<=day && day<=exit_at.major
                            }
                        )(schedule)
                    }
                );
            }
        );

        const connections = connectedUsers.map(
            ({Following})=>{
                const validFollowing = Following.filter(({expired_at})=>expired_at===null)[0];
                const {follower_id, followee_id} = validFollowing;
                return {
                    follower_id, followee_id
                }
            }
        );
        
        const connectionGroups = (
            (connections)=>{
                const step = (remain, connectionGroups)=>{
                    if(remain.length===0){
                        return {remain, connectionGroups};
                    }
                    const lastGroup = connectionGroups[connectionGroups.length-1];
                    const remainGroups = connectionGroups.slice(0, connectionGroups.length-1);
                    if(lastGroup.length===0){
                        return {
                            remain: remain.slice(1),
                            connectionGroups: [...remainGroups, [remain[0]]]
                        };
                    }
                    const lastConnection = lastGroup[lastGroup.length-1];
                    const {followee_id} = lastConnection;
                    const followingConnectionIndex = remain.findIndex(
                        ({follower_id})=>follower_id===followee_id
                    );
                    if(followingConnectionIndex<0){
                        return {
                            remain,
                            connectionGroups: [...connectionGroups, []]
                        }
                    }
                    const newRemain = [...remain];
                    newRemain.splice(followingConnectionIndex, 1);
                    return {
                        remain: newRemain,
                        connectionGroups: [...remainGroups, [...lastGroup, remain[followingConnectionIndex]]]
                    }
                };
                let remain = connections;
                let connectionGroups = [[]];
                while(remain.length>0){
                    const stepReult = step(remain, connectionGroups);
                    remain = stepReult.remain;
                    connectionGroups = stepReult.connectionGroups;
                }
                return connectionGroups;
            }
        )(connections);

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
        return {
            error
        }
    }
    finally{
        await closeSequelize(sequelize);
    }
}

module.exports = getConnectionDocument;