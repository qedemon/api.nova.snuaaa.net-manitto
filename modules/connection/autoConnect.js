const getNow = require("modules/Utility/getNow");
const {convertDateToSession} = require("modules/Utility/Session");
const executeAutoConnect = require("./executeAutoConnect");
const getConnectionDocumentFromConnections = require("./getConnectionDocumentFromConnections");

async function editData(connections, inputData){
    return Promise.all(
        connections.map(
            (connections, index)=>{
                return (
                    async (connections, inputData)=>{
                        const shouldBeConnected = Array.from(
                            (
                                new Map(
                                    [
                                        ...inputData.connected.map((user)=>[user.user_id, user]),
                                        ...inputData.disconnected.map((user)=>[user.user_id, user])
                                    ]
                                )
                            ).values()
                        ).map(
                            (user)=>{
                                user.schedule = user.Schedule;
                                return user;
                            }
                        );
                        
                        return (
                            await getConnectionDocumentFromConnections(
                                connections.map(
                                    ({followee_id, follower_id})=>{
                                        return {
                                            follower: follower_id,
                                            followee: followee_id
                                        }
                                    }
                                ),
                                shouldBeConnected
                            )
                        ).document??{
                            disconnected: [],
                            connected: [],
                            connectionGroups: []
                        };
                    }
                )(connections, inputData[index])
            }
        )
    );
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
            data: await editData(connectData.connections, inputData)
        }
    }
    catch(error){
        return {
            error
        }
    }
}

module.exports = autoConnect;