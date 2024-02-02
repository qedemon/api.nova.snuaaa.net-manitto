const {convertDateToUnit} = require("modules/Utility/convertDate");
const getNow = require("modules/Utility/getNow");
const getToday = require("modules/Utility/getToday");
const executeAutoConnect = require("./executeAutoConnect");
const getConnectionGroups = require("modules/Utility/connectionGroups");

function editData(inputData, connections){
    return inputData.map(
        (inputData, index)=>{
            return (
                ({disconnected, connected}, connectionsToUpdate)=>{
                    const users = [...disconnected, ...connected]
                    .map(
                        (
                            (connections)=>(user)=>{
                                const followingConnection = connections.find(({follower_id})=>follower_id===user.user_id);
                                const followedConnection = connections.find(({followee_id})=>followee_id===user.user_id);
                                return {
                                    ...user,
                                    following: followingConnection?.followee_id??null,
                                    followed: followedConnection?.follower_id??null
                                }
                            }
                        )(connectionsToUpdate)
                    );
                    const newDisconnected = users.filter(({following, followed})=>(following===null)&&(followed===null));
                    const newConnected= users.filter(({following, followed})=>(following!==null)||(followed!==null));
                    const newConnections = newConnected.map(
                        ({following, user_id})=>{
                            return {
                                follower_id: user_id,
                                followee_id: following
                            }
                        }
                    );
                    return {
                        disconnected: newDisconnected,
                        connected: newConnected,
                        connectionGroups: getConnectionGroups(newConnections)
                    }
                }
            )(inputData, connections[index])
        }
    )
}

async function autoConnect(command, inputData, today=getToday()){
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
        console.log(users.length);
    
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
        const {data: connectData, error} = await executeAutoConnect(
            {
                users,
                connections0: connections[0]??[],
                connections1: connections[1]??[],
                connections2: connections[2]??[],
                command: selectedCommand,
                day: today
            }
        )
        if(error){
            throw error;
        }

        return {
            command: selectedCommand,
            data: editData(inputData, connectData.connections)
        }
    }
    catch(error){
        return {
            error
        }
    }
}

module.exports = autoConnect;