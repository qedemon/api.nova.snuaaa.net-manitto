const {connect} = require("modules/mongoose");
const {User} = require("models/mongoDB");
const connectionGroups = require("modules/Utility/connectionGroups");
const {convertDateToUnit} = require("modules/Utility/convertDate");
const getNow = require("modules/Utility/getNow");

function distributables(user){
    const {_id, user_id, name, col_no, major, schedule} = user;
    return {
        user_id: user_id??_id,
        name,
        col_no,
        major,
        schedule: schedule?
            {
                enter_at: convertDateToUnit(schedule.enter_at),
                exit_at: convertDateToUnit(schedule.exit_at)
            }:
            {},
        Schedule: schedule
    }
}

async function getConnectionDocumentFromConnections(inputConnections, shouldBeConnected){
    try{
        const connectedIds = Array.from(
            new Set(
                inputConnections.reduce(
                    (result, {follower, followee})=>{
                        return [
                            ...result,
                            follower,
                            followee
                        ]
                    },
                    []
                )
            )
        ).filter((item)=>item);
        
        const connected = await Promise.all(
            connectedIds.map(
                async (userId)=>{
                    const user = shouldBeConnected.find(
                        (user)=>userId===user.user_id
                    )
                    return distributables(
                        user??(await User.findById(userId))
                    );
                }
            )
        );

        const disconnected = shouldBeConnected.filter(
            ({user_id})=>{
                const connectedId = connectedIds.find((id)=>id===user_id);
                return !connectedId;
            }
        ).map(
            (user)=>distributables(user)
        );

        console.assert(connected.every((user)=>user), connected);
        return {
            document: {
                disconnected,
                connected,
                connectionGroups: connectionGroups(inputConnections.map(({follower, followee})=>({follower_id: follower, followee_id: followee})))
            }
        }
    }
    catch(error){
        return {
            error
        }
    }
}

module.exports = getConnectionDocumentFromConnections