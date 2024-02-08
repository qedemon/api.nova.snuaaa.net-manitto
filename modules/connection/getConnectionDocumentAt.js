const {connect, disconnect} = require("modules/mongoose");
const {User} = require("models/mongoDB");
const getConnections = require("./getConnections");
const {convertDateToUnit, convertUnitToDate} = require("modules/Utility/convertDate");
const getNow = require("modules/Utility/getNow");
const getConnectionGroups = require("modules/Utility/connectionGroups");

async function getConnectionDocumentAt(at=getNow()){
    try{
        await connect();
        const connections = (await getConnections({}, at))[0]
        .connections.map(({follower, followee})=>({follower_id: follower, followee_id: followee}));

        const connectedIds = Array.from(
            new Set(
                [
                    ...connections.map(({follower_id})=>follower_id),
                    ...connections.map(({followee_id})=>followee_id)
                ]
            )
        );

        const userDistributables = ({_id:user_id, col_no, major, name, schedule})=>{
            return {
                user_id,
                col_no,
                major,
                name,
                schedule: {
                    enter_at: convertDateToUnit(schedule.enter_at),
                    exit_at: convertDateToUnit(schedule.exit_at)
                },
                Schedule: schedule
            }
        };

        const connected = (
            await Promise.all(
                connectedIds.map(
                    (userId)=>{
                        return User.findById(userId).exec()
                    }
                )
            )
        ).map(
            userDistributables
        );
        const shouldBeConnected = await User.find(
            {
                isAdmin: false,
                "schedule.enter_at": {
                    $lte: at
                },
                "schedule.exit_at": {
                    $gte: at
                }
            }
        );
        const disconnected = shouldBeConnected.filter(
            ({_id: targetId})=>{
                return !connected.some(
                    ({user_id})=>{
                        return user_id===targetId
                    }
                )
            }
        ).map(userDistributables);

        const connectionGroups = getConnectionGroups(connections);
        
        return {
            data: {
                disconnected,
                connected,
                connectionGroups
            }
        }
    }
    catch(error){
        console.error(error);
        return {
            error
        }
    }
}

module.exports = getConnectionDocumentAt;