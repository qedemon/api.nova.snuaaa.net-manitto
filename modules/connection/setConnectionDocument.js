const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModel = require("models");
const {convertDateToUnit, convertUnitToDate} = require("modules/Utility/convertDate");
const getNow = require("modules/Utility/getNow");
const getToday = require("modules/Utility/getToday");
const getConnectionDocument = require("./getConnectionDocument");
const connect = require("./connect");
const disconnect = require("./disconnect");

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
                data
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
        await updates.toDisconnect.reduce(
            async (last, toDisconnect)=>{
                await last;
                const {error} = await disconnect(toDisconnect.follower_id, toDisconnect.followee_id, sequelize, (day>today)?{willBeValid: day}:{});
            },
            Promise.resolve()
        );
        await updates.toConnect.reduce(
            async (last, toConnect)=>{
                await last;
                if(toConnect.followee_id)
                    await connect(toConnect.follower_id, toConnect.followee_id, sequelize, (day>today)?{willBeValid: day}:{});
                else
                    await disconnect(toConnect.follower_id, null, sequelize, (day>today)?{willBeValid: day}:{});
            },
            Promise.resolve()
        );
        
        return {
            day, 
            updates,
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