const {convertDateToUnit, convertUnitToDate} = require("modules/Utility/convertDate");
const getNow = require("modules/Utility/getNow");
const getConnectionDocumentAt = require("./getConnectionDocumentAt");
const setConnections = require("./setConnections");
const {convertDateToSession, sessions} = require("modules/Utility/Session");

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
    return {
        toConnect: planToConnect.filter(({followee_id})=>followee_id),
        toDisconnect: [...planToDisconnect, ...planToConnect.filter(({followee_id})=>followee_id??false)]
    }
}

async function setConnectionDocument(targetSessionNo, data, at=getNow()){
    try{
        const targetSession = sessions[targetSessionNo];
        const {newDocument, disconnected, connected, revoke, isCurrent} = await (
            async (targetDocument, targetSessionNo, targetSession, at)=>{
                const {sessionNo: currentSessionNo} = convertDateToSession(at);

                const isCurrent = targetSessionNo===currentSessionNo;

                const targetAt = (targetSessionNo===currentSessionNo)?
                    at:
                    (targetSessionNo<currentSessionNo)?
                        targetSession.endAt:
                        targetSession.startAt;

                const prevDocument = {
                    at: targetAt,
                    ...(await getConnectionDocumentAt(targetAt)).data
                };
                if(targetSessionNo<currentSessionNo){
                    return {
                        newDocument: prevDocument,
                        disconnected: [],
                        connected: [],
                        revoke: ()=>{
                            return {}
                        },
                        isCurrent
                    }
                }
                const connections = {
                    validAt: targetAt,
                    expiredAt: targetSession.endAt,
                    connections: targetDocument.connectionGroups.reduce(
                        (result, connectionGroup)=>{
                            return [...result, ...connectionGroup]
                        },
                        []
                    )
                    .map(
                        ({follower_id, followee_id})=>(
                            {
                                follower: follower_id,
                                followee: followee_id
                            }
                        )
                    )
                }
                const {inserted, revoke} = await setConnections(connections);
                const {data: newDocument} = await getConnectionDocumentAt(targetAt);
                const {toConnect: connected, toDisconnect: disconnected} = getUpdate(prevDocument, newDocument);
                return {
                    inserted,
                    revoke,
                    newDocument,
                    disconnected,
                    connected,
                    isCurrent
                };
            }
        )(data, targetSessionNo, targetSession, at)
        return {
            day: targetSessionNo,
            isCurrent,
            revoke,
            updates: {
                disconnected: disconnected.map(({follower_id, followee_id})=>{return {follower_id, followee_id}}),
                connected: connected.map(({follower_id, followee_id})=>{return {follower_id, followee_id}})
            },
            data: newDocument
        }
    }
    catch(error){
        console.error(error);
        return {
            error
        }
    }
}

module.exports = setConnectionDocument;