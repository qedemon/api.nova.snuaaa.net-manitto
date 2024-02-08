const getConnectionDocument = require("./getConnectionDocument");

test("getConnectionDocument", async ()=>{
    const {data, error} = await getConnectionDocument(0);
    if(error){
        console.error(error);
        throw error;
    }
    const {connectionGroups} = data;
    connectionGroups.every(
        (group)=>{
            const last = group[group.length-1];
            const first = group[0];
            return (first.follower_id === last.followee_id) || (last.followee_id===null);
        }
    )
})