const {connect} = require("modules/mongoose");
const {User} = require("models/mongoDB");
const {getConnections} = require("modules/connection/module");
const {convertDateToUnit} = require("modules/Utility/convertDate");
const getNow = require("modules/Utility/getNow");
const mergeConnections = require("modules/Utility/mergeConnections");

async function getAllUser(at=getNow()){
    try{ 
        await connect();
        const users = await User.find(
            {
                isAdmin: false
            }
        ).populate("mission");
        const {documents: connections} = await getConnections({expired: true});
        const userDistributables = ({_id, name, col_no, major, schedule})=>{
            return {
                user_id: _id,
                name,
                col_no,
                major,
                schedule
            }
        };
        const missionDistributables = ({title, description, difficulty})=>(
            {
                title, description, difficulty
            }
        )
        const findConnections = (userId, myKey, targetKey)=>{
            const relatedConnections = connections.reduce(
                (result, connectionDocument)=>{
                    const {connections, expiredAt, validAt} = connectionDocument;
                    const userConnection = connections.find(
                        ({[myKey]: target})=>{
                            return target===userId
                        }
                    );
                    const target = userConnection?userConnection[targetKey]:null;
                    if(userConnection){
                        return [
                            ...result,
                            {
                                start: validAt,
                                end: expiredAt,
                                isValid: connectionDocument.isValidAt(at),
                                [myKey]: userId,
                                [targetKey]: target
                            }
                        ]
                    }
                    else{
                        return result;
                    }
                },
                []
            );
            return mergeConnections(relatedConnections)
            .map(
                ({[myKey]: _, [targetKey]: targetId, ...remain})=>{
                    const targetUser = users.find(
                        ({_id})=>_id===targetId
                    );
                    const restTargetUserInfo = (
                        (user)=>{
                            if(user){
                                const {name, col_no, major, mission} = user;
                                return {name, col_no, major, mission};
                            }
                            return {};
                        }
                    )(targetUser);
                    return {
                        user_info: {
                            user_id: targetId,
                            ...restTargetUserInfo
                        },
                        ...remain
                    }
                }
            ).map(
                ({start, end, ...rest})=>(
                    {
                        ...rest,
                        start_at: start,
                        expired_at: end,
                        start: convertDateToUnit(start),
                        end: convertDateToUnit(end)
                    }
                )
            )
        }

        return {
            users: users.map(
                (user)=>{
                    return {
                        ...userDistributables(user),
                        mission: missionDistributables(user.mission),
                        following: findConnections(user._id, "follower", "followee"),
                        followed: findConnections(user._id, "followee", "follower")
                    }
                }
            )
        }
    }
    catch(error){
        return {error};
    }
}

module.exports = getAllUser;