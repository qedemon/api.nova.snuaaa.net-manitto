const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModel = require("models");
const {convertDateToUnit, convertUnitToDate} = require("modules/Utility/convertDate");
const getNow = require("modules/Utility/getNow");
const getToday = require("modules/Utility/getToday");
const getConnectionDocument = require("./getConnectionDocument");
const connect = require("./connect");
const disconnect = require("./disconnect");
const {sendPush} = require("modules/push/module");

function getUpdate(prevData, data){
    const newConnections = data.connectionGroups.reduce(
        (result, group)=>{
            return [...result, ...group.filter(({follwee_id})=>follwee_id!==null)];
        },
        []
    );
    const prevConnections = prevData.connectionGroups.reduce(
        (result, group)=>{
            return [...result, ...group.filter(({follwee_id})=>follwee_id!==null)];
        },
        []
    );
    const planToConnect = newConnections.reduce(
        (result, connection)=>{
            const prevConnection = prevConnections.find(
                ({follower_id})=>{
                    return follower_id===connection.follower_id;
                }
            );
            if(prevConnection?.followee_id === connection.followee_id){
                return result;
            }
            return [...result, connection];
        },
        []
    );
    const planToDisconnect = prevConnections.reduce(
        (result, connection)=>{
            const newConnection = newConnections.find(
                ({follower_id})=>{
                    return follower_id===connection.follower_id;
                }
            );
            if(newConnection?.followee_id === connection.followee_id){
                return result;
            }
            return [...result, connection];
        },
        []
    );
    /*console.log("new", newConnections);
    console.log("prev", prevConnections);
    console.log("connect", planToConnect);
    console.log("disconnect", planToDisconnect);*/
    return {
        toConnect: planToConnect,
        toDisconnect: planToDisconnect
    }
}

async function setConnectionDocument(day, data, loadedSequelize=null, today=getToday()){
    const sequelize = loadedSequelize || (await createSequelize()).sequelize;
    const Sequelize = sequelize.Sequelize;
    const {DataTypes, Op} = Sequelize;
    try{
        if(day<today)
            return {
                day,
                data: (await getConnectionDocument(day, sequelize, today)).data,
            };
        const prevData = await (
            async ()=>{
                const {data, error} = await getConnectionDocument(day, sequelize, today);
                if(error){
                    throw error;
                }
                return data
            }
        )();
        
        const updates = getUpdate(prevData, data);
        const disconnected = await updates.toDisconnect.reduce(
            async (last, toDisconnect)=>{
                const result = await last;
                const {error, disconnected} = await disconnect(toDisconnect.follower_id, toDisconnect.followee_id, sequelize, (day>today)?{willBeValid: day}:{});
                if(error){
                   return result; 
                }
                return [...result, ...disconnected]
            },
            Promise.resolve([])
        );
        const {connected, disconnected: additionalDisconnected} = await updates.toConnect.reduce(
            async (last, toConnect)=>{
                const result = await last;
                if(toConnect.followee_id){
                    const {error, connected, disconnected} = await connect(toConnect.follower_id, toConnect.followee_id, sequelize, (day>today)?{willBeValid: day}:{});
                    if(error){
                        return result;
                    }
                    return {
                        connected: [...result.connected, ...connected],
                        disconnected: [...result.disconnected, ...disconnected]
                    };
                }
                else{
                    const {error, disconnected} = await disconnect(toConnect.follower_id, null, sequelize, (day>today)?{willBeValid: day}:{});
                    if(error){
                        return result;
                    }
                    return {
                        connected: result.connected,
                        disconnected: [...result.disconnected, ...disconnected]
                    }
                }
            },
            Promise.resolve({connected:[], disconnected:[]})
        );

        console.log(`day${day}`, "disconnected", [...disconnected, ...additionalDisconnected]);
        console.log(`day${day}`, "connected", connected);
        if(day === today){
            const pushList = [...(new Set([...disconnected, ...additionalDisconnected, ...connected].map(({follower_id})=>follower_id)))];
            console.log(`day ${day} pushList`, pushList);
            const pushed = (
                await Promise.all(
                    pushList.map(
                        async (user_id)=>{
                            return await sendPush(user_id, 
                                {
                                    title: "AAA-Manitto",
                                    body: "마니또가 바뀌었어요"
                                }
                            );
                        }
                    )
                )
            ).reduce(
                (result, {error, pushed})=>{
                    if(error){
                        return result;
                    }
                    return [...result, ...pushed];
                },
                []
            );
            console.log("pushlist: :", pushList.length, ", pushed: ", pushed.length);
        }

        
        return {
            day, 
            updates: {
                disconnected: [...disconnected, ...additionalDisconnected].map(({follower_id, followee_id})=>{return {follower_id, followee_id}}),
                connected: connected.map(({follower_id, followee_id})=>{return {follower_id, followee_id}})
            },
            data: await (
                async ()=>{
                    const {data, error} = await getConnectionDocument(day, sequelize, today);
                    if(error){
                        throw error;
                    }
                    return data
                }
            )()
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

module.exports = setConnectionDocument;