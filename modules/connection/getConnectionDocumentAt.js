const {connect, disconnect} = require("modules/mongoose");
const {User} = require("models/mongoDB");
const getConnections = require("./getConnections");
const {convertDateToUnit, convertUnitToDate} = require("modules/Utility/convertDate");
const getNow = require("modules/Utility/getNow");
const getConnectionGroups = require("modules/Utility/connectionGroups");

async function getConnectionDocumentAt(at=getNow(), from=getNow()){
    try{
        await connect();
        const {documents, error} = await getConnections({}, at);
        if(error){
            throw error;
        }
        const connections = documents[0]?
        documents[0].connections.map(({follower, followee})=>({follower_id: follower, followee_id: followee})):
        [];

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
                    async (userId)=>{
                        const user = await User.findById(userId).exec();
                        return user;
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
                    $lte: at,
                    $lte: from
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
                at,
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