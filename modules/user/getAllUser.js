const {connect} = require("modules/mongoose");
const {User, ConnectionDocument} = require("models/mongoDB");
const {getConnections} = require("modules/connection/module");
const {convertDateToUnit} = require("modules/Utility/convertDate");
const getNow = require("modules/Utility/getNow");

async function getAllUser(at=getNow()){
    try{ 
        await connect();
        const users = await User.find(
            {
                isAdmin: false
            }
        ).populate("mission");
        const connections = await getConnections({expired: true});
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
        const findConnections = (userId, key)=>{
            const relatedConnections = connections.reduce(
                (result, {connections, expiredAt, validAt})=>{
                    const userConnection = connections.find(
                        ({[key]: target})=>{
                            return target===userId
                        }
                    );
                    if(userConnection){
                        return [
                            ...result,
                            {
                                follower: userConnection.follower,
                                followee: userConnection.followee,
                                expiredAt,
                                validAt
                            }
                        ]
                    }
                    else{
                        return result;
                    }
                },
                []
            );
            return relatedConnections.map(
                ({follower, followee, expiredAt, validAt})=>(
                    {
                        follower, followee, expiredAt, validAt
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
                        following: findConnections(user._id, "follower")
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