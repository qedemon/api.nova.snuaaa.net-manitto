function mergeConnections(connections){
    const result =  connections
    .sort(
        (a, b)=>a.validAt-b.validAt
    ).reduce(
        (result, currentConnection)=>{
            const lastConnection = result[result.length-1];
            if((lastConnection?.followee === currentConnection.followee) && (lastConnection?.follower === currentConnection.follower)){
                return [
                    ...result.slice(0, result.length-1),
                    {
                        ...currentConnection,
                        start: lastConnection.start
                    }
                ]
            }
            return [
                ...result, 
                currentConnection
            ]
        },
        []
    );
    console.assert(result.every(
        ({start, end})=>{
            return start<=end;
        }
    ), connections);
    return result;
}

module.exports = mergeConnections;