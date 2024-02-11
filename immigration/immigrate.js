require("dotenv").config();
const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");
const {connect: connectMongo, disconnect: disconnectMongo} = require("modules/mongoose");
const { User: mongoDBUser, Mission: mongoDBMission, ConnectionDocument, Policy} = require("models/mongoDB");

const run = async ()=>{
    const {sequelize} = await createSequelize();
    const Sequelize = sequelize.Sequelize;
    const {Connection, User, Schedule, Push, Mission} = defineModels(sequelize, Sequelize.DataTypes);
    const missions = await Mission.findAll();
    const immigrateMissions = missions.map(
        ({id, title, description, difficulty, maximum})=>{
            return {
                _id: id,
                title, description, difficulty,
                maximum: 10
            }
        }
    )
    const users = await (
        User.findAll(
            {
                include: [
                    Schedule,
                    Push,
                    Mission
                ]
            }
        )
    );
    const immigrateUsers = users.map(
        ({user_id, isAdmin, id, name, col_no, major, Schedule, Push, Mission})=>{
            return {
                _id: user_id,
                isAdmin,
                name,
                id,
                col_no,
                major,
                schedule: {
                    enter_at: new Date(Schedule.enter_at),
                    exit_at: new Date(Schedule.exit_at.getTime()-9*60*60*1000)
                },
                mission: Mission.id,
                push: Push?
                {
                    subscription: JSON.parse(Push.subscription)
                }:
                null
            }
        }
    );
    const connections = await Connection.findAll(
        {
            where: {
                willBeValid: null
            }
        }
    );
    const immigrateConnectionsRawData = connections.map(
        ({id, follower_id, followee_id, createdAt, expired_at})=>{
            const toHourTime = (time)=>{
                return new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours())
            }
            return {
                id,
                followerId: follower_id,
                followeeId: followee_id,
                createdAt,
                expired_at: new Date(expired_at??"2024-02-05T16:00:00+09:00"),
                validAt: toHourTime(createdAt),
                expiredAt: toHourTime(new Date(expired_at??"2024-02-05T16:00:00+09:00"))
            }
        }
    )
    const times = 
    [
        ...immigrateConnectionsRawData.map(
            ({validAt})=>validAt
        ),
        ...immigrateConnectionsRawData.map(
            ({expiredAt})=>expiredAt
        )
    ].reduce(
        (result, time)=>{
            if(!result.find(
                (found)=>{
                    return (found-time)==0;
                }
            )){
                return [...result, time];
            }
            return result;
        },
        []
    ).sort((a, b)=>a-b)
    .map(
        (value, index, array)=>{
            if(index<array.length-1){
                return {
                    validAt: value,
                    expiredAt: array[index+1]
                }
            }
        }
    )
    .filter((item)=>item);

    const connectionsDocuments = times.map(
        ({validAt, expiredAt})=>{
            const validConnections = immigrateConnectionsRawData.filter(
                ({expired_at, createdAt})=>{
                    return  (createdAt<expiredAt) && (expired_at>=expiredAt);
                }
            )
            return {
                validAt,
                expiredAt,
                connections: validConnections.map(
                    ({followerId, followeeId})=>{
                        return {
                            follower: followerId??23,
                            followee: followeeId??23,
                        }
                    }
                )
            };
        }
    )

    const connectionIDs = 
    Array.from(
        new Set(
            connectionsDocuments.reduce(
                (result, {connections: validConnections})=>{
                    return [...result, ...validConnections.map(({id})=>id)];
                },
                []
            )
        )
    );
    const excluded = immigrateConnectionsRawData.filter(
        ({id})=>{
            return !connectionIDs.includes(id)
        }
    )
    
    await closeSequelize(sequelize);

    if(process.argv.includes("import")){
        console.log("import to MongoDB");
        await connectMongo();
        await mongoDBMission.deleteMany({});
        await mongoDBMission.create(immigrateMissions);
        await mongoDBUser.deleteMany({});
        await mongoDBUser.create(immigrateUsers);
        await ConnectionDocument.deleteMany({});
        await ConnectionDocument.create(connectionsDocuments)
        await Policy.deleteMany({});
        await Policy.create(
            {
                SHOW_FOLLOWEE: false,
                SHOW_FOLLOWER: false
            }
        )
        await disconnectMongo();
    }
    
};
run();