const {connect} = require("modules/mongoose");
const {User} = require("models/mongoDB");
const connectionGroups = require("modules/Utility/connectionGroups");
const {convertDateToUnit} = require("modules/Utility/convertDate");
const getNow = require("modules/Utility/getNow");

function distributables(user){
    const {_id: user_id, name, col_no, major, schedule} = user;
    return {
        user_id,
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

async function getConnectionDocumentFromConnections(inputConnections, from=getNow()){
    const {validAt, expiredAt, connections} = inputConnections;
    try{
        const connectedIds = Array.from(
            new Set(
                connections.reduce(
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
                    const user = await User.findById(userId);
                    return distributables(user);
                }
            )
        )
        const shouldBeConnected = await User.find(
            {
                isAdmin: false,
                "schedule.enter_at": {
                    $lte: expiredAt,
                    $lte: from
                },
                "schedule.exit_at": {
                    $gte: validAt
                }
            }
        );
        const disconnected = shouldBeConnected.filter(
            ({_id: user_id})=>{
                const connectedId = connectedIds.find(({id})=>id===user_id);
                return !connectedId;
            }
        ).map(
            (user)=>distributables(user)
        );
        return {
            document: {
                disconnected,
                connected,
                connectionGroups: connectionGroups(connections.map(({follower, followee})=>({follower_id: follower, followee_id: followee})))
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