const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");
const {convertDateToUnit} = require("modules/Utility/convertDate");
const getNow = require("modules/Utility/getNow");

async function getAllUser(at=getNow()){
    const sequelize = (loadedSequelize || (await createSequelize()).sequelize);
    const Models = defineModels(sequelize, sequelize.Sequelize.DataTypes);
    const User = Models.User;
    const Connection = Models.Connection;
    const Mission = Models.Mission;
    const Schedule = Models.Schedule;
    try{ 
        const users = await User.findAll(
            {
                where: {
                    isAdmin: false
                },
                attributes: [
                    'user_id',
                    'name',
                    'col_no',
                    'major',
                ],
                include: [
                    {
                        model: Mission,
                        attributes: ["title", "description", "difficulty"]
                    },
                    {
                        model: Schedule,
                        attributes: ["enter_at", "exit_at"]
                    },
                    {
                        model: Connection,
                        as: "Following",
                        include: {
                            model: User,
                            as: "Followee",
                            include: Mission
                        },
                    },
                    {
                        model: Connection,
                        as: "Followed",
                        include: {
                            model: User,
                            as: "Follower",
                            include: Mission
                        },
                    },
                ]
            }
        );

        const filterUser = ({user_id, name, col_no, major})=>{
            return {
                user_id, name, col_no, major
            }
        };
        const filterMission = ({mission_id, title, description, difficulty})=>{
            return {
                mission_id, title, description, difficulty
            };
        };
        const filterConnection = ({connection, userKey})=>{
            return {
                user_info: {
                    ...filterUser(connection[userKey]), 
                    mission: (
                        (Mission)=>{
                            return Mission?filterMission(Mission):{};
                        }
                    )(connection[userKey].Mission)
                },
                expired_at: connection.expired_at,
                isValid: connection.isValid,
                willBeValid: connection.willBeValid
            }
        };
        const filterSchedule = ({enter_at, exit_at})=>{
            return {
                enter_at,
                exit_at
            }
        };
        return {
            users: users.map(
                (user)=>{
                    const mission = (
                        (mission)=>{
                            return mission?filterMission(mission):{};
                        }
                    )(user.Mission);
                    const [following, followed] = [{connections: user.Following, userKey: "Followee"}, {connections: user.Followed, userKey: "Follower"}].map(
                        ({connections, userKey})=>{
                            return connections?
                                connections
                                .sort(
                                    (a, b)=>{
                                        if(a.expired_at === null){
                                            return 1;
                                        }
                                        if(b.expired_at === null){
                                            return -1;
                                        }
                                        if(a.expired_at<b.expired_at){
                                            return -1;
                                        }
                                        if(a.expired_at>b.expired_at){
                                            return 1;
                                        }
                                        return 0;
                                    }
                                )
                                .filter(({willBeValid})=>{
                                    return willBeValid===null;
                                })
                                .map((connection)=>{return {connection, userKey}})
                                .map(filterConnection)
                                .reduce(
                                    ({lastStart, connections}, connection)=>{
                                        return {
                                            lastStart: connection.expired_at,
                                            connections: [
                                                ...connections,
                                                {
                                                    ...connection,
                                                    start_at: lastStart
                                                }
                                            ]
                                        }
                                    },
                                    {lastStart: user.Schedule.enter_at, connections:[]}
                                ).connections
                                .map(
                                    (connection)=>{
                                        return {
                                            ...connection,
                                            start: convertDateToUnit(new Date(connection.start_at)),
                                            end: connection.expired_at?convertDateToUnit(new Date(connection.expired_at)):convertDateToUnit(getNow())
                                        }
                                    }
                                )
                                :[];
                        }
                    );
                    const schedule = (
                        (schedule)=>{
                            return schedule?filterSchedule(schedule):{};
                        }
                    )(user.Schedule);
                    return {
                        ...filterUser(user),
                        mission,
                        following,
                        followed,
                        schedule
                    }
                }
            )
        }
    }
    catch(error){
        return {error};
    }
    finally{
        if(loadedSequelize === null)
            await closeSequelize(sequelize);
    }
}

module.exports = getAllUser;