const getNow = require("modules/Utility/getNow");
const {convertDateToSession} = require("modules/Utility/Session");
const executeAutoConnect = require("./executeAutoConnect");
const getConnectionGroups = require("modules/Utility/connectionGroups");

function editData(connections, prevData, users){
    return connections.map(
        (connections, index)=>{
            return (
                (connections, prevData, users)=>{
                    const connectedIds = Array.from
                    (
                        new Set(
                            connections.reduce(
                                (result, {follower_id, followee_id})=>{
                                    return [
                                        ...result, follower_id, followee_id
                                    ]
                                },
                                []
                            )
                        )
                    ).filter((id)=>id);
                    const connected = connectedIds.map(
                        (user_id)=>{
                            const found = users.find(
                                (user)=>(user.user_id === user_id)
                            );
                            return found??{
                                user_id
                            };
                        }
                    );
                    const shouldBeConnected = Array.from(
                        (
                            new Map(
                                [
                                    ...prevData.connected.map((user)=>[user.user_id, user]),
                                    ...prevData.disconnected.map((user)=>[user.user_id, user])
                                ]
                            )
                        ).values()
                    )
                    const disconnected = shouldBeConnected.filter(
                        ({user_id: targetId})=>{
                            return !connectedIds.some(
                                (user_id)=>user_id===targetId
                            )
                        }
                    )
                    
                    console.assert(connected.every((user)=>user), connected);
                    return {
                        disconnected,
                        connected,
                        connectionGroups: getConnectionGroups(connections)
                    }
                }
            )(connections, prevData[index], users)
        }
    )
}

async function autoConnect(command, inputData, sessionNo=convertDateToSession(getNow()).sessionNo){
    try{
        const commands = {
            "linear": "1",
            "circular": "0"   
        };
        const selectedCommand = commands[command];
        if(selectedCommand===undefined){
            throw new Error(`invalid command : ${command}`);
        }
        const users = Array.from(
            (
                new Map(
                    inputData.reduce(
                        (result, {disconnected, connected})=>[...result, ...disconnected, ...connected],
                        []
                    ).map(
                        (user)=>{
                            return [
                                user.user_id,
                                {
                                    ...user,
                                    col_no: user.col_no===""?"23":user.col_no
                                }
                            ]
                        }
                    )
                )
            ).values()
        );
    
        const connections = inputData.map(
            ({connectionGroups})=>{
                return connectionGroups
                .reduce(
                    (result, group)=>{
                        return [...result, ...group.filter(({followee_id})=>followee_id!==null)];
                    },
                    []
                )
            }
        );
        const input = {
            users,
            connections0: connections[0]??[],
            connections1: connections[1]??[],
            connections2: connections[2]??[],
            command: selectedCommand,
            day: sessionNo
        };
        const {data: connectData, error} = await executeAutoConnect(input)
        if(error){
            throw error;
        }

        return {
            command: selectedCommand,
            input,
            output: connectData,
            data: editData(connectData.connections, inputData, users)
        }
    }
    catch(error){
        return {
            error
        }
    }
}

module.exports = autoConnect;