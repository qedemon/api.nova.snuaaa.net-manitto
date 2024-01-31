function getConnectionGroups(connections){
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
    connectionGroups = connectionGroups.filter(group=>group.length>0);
    connectionGroups = (
        (connectionGroups)=>{
            const getLinkable = (groupA, groupB)=>{
                return groupA[groupA.length-1].followee_id === groupB[0].follower_id;
            }
            const findLinkable = (connectionGroups)=>{
                let tailIndex = -1;
                const headIndex = connectionGroups.findIndex(
                    (group, groupIndex, groups)=>{
                        const anotherGroupIndex = groups.findIndex((anotherGroup)=>getLinkable(group, anotherGroup));
                        tailIndex = anotherGroupIndex;
                        return (anotherGroupIndex>=0) && (groupIndex!==anotherGroupIndex);
                    }
                );
                return {headIndex, tailIndex};
            };
            
            let groups = connectionGroups;
            while(true){
                const {headIndex, tailIndex} = findLinkable(groups);
                if(headIndex<0){
                    break;
                }
                const headGroup = groups[headIndex];
                const tailGroup = groups[tailIndex];
                const remainGroups = groups.filter((_, index)=>(index!==headIndex) && (index!==tailIndex));
                groups = [
                    ...remainGroups,
                    [...headGroup, ...tailGroup]
                ]
            }
            return groups;
        }
    )(connectionGroups);    //연결할 수 있는 것은 연결한다.
    /*connectionGroups.map(
        (group)=>{
            const remain = group.slice(0, group.length-1);
            const last = group[group.length-1];
            return [
                ...remain,
                (last?.followee_id === group[0]?.follower_id)?last:{...last, followee_id: null}
            ]
        }
    )*/
    
    return connectionGroups;
}

module.exports = getConnectionGroups;