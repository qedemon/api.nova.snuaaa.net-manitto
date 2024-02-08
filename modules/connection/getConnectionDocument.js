const {connect, disconnect} = require("modules/mongoose");
const {User} = require("models/mongoDB");
const getConnections = require("./getConnections");
const {convertDateToUnit, convertUnitToDate} = require("modules/Utility/convertDate");
const getNow = require("modules/Utility/getNow");
const getConnectionGroups = require("modules/Utility/connectionGroups");
const {sessions, convertDateToSession} = require("modules/Utility/Session");

async function getConnectionDocument(targetSessionNo, at=getNow()){
    try{
        const sessionFrom=convertDateToSession(at);
        const targetSession = sessions[targetSessionNo];
        const connections = ( 
            await (
                (targetSession, sessionFrom)=>{
                    if(targetSession.sessionNo<sessionFrom.sessionNo){
                        return getConnections({},targetSession.session.endAt)
                    }
                    else if(targetSession.sessionNo===sessionFrom.sessionNo){
                        return getConnections({}, at);
                    }
                    else{
                        return getConnections({}, targetSession.session.startAt)
                    }
                }
            )({sessionNo:targetSessionNo, session: targetSession}, sessionFrom)
        )[0]
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
                }
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
            (
                (targetSession)=>{
                    const filter = {
                        isAdmin: false
                    };
                    if(targetSession.endAt){
                        filter["schedule.enter_at"]={
                            $lte: targetSession.endAt
                        }
                    }
                    if(targetSession.startAt){
                        filter["schedule.exit_at"]={
                            $gte: targetSession.startAt
                        }
                    }
                    return filter;
                }
            )(targetSession)
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
                editable: targetSessionNo>=sessionFrom.sessionNo,
                current: targetSessionNo===sessionFrom.sessionNo,
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

module.exports = getConnectionDocument;