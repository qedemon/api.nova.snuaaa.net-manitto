const {connect: connectMongo} = require("modules/mongoose");
const {User} = require("models/mongoDB");
const {getConnections} = require("modules/connection/module");
const mergeConnections = require("modules/Utility/mergeConnections");

async function getUser(condition){
    try{
        const connection = await connectMongo();
        const transformedCondition = (
            (condition)=>{
                const {user_id, ...rest} = condition;
                return (user_id!==undefined)?
                {
                    ...rest,
                    _id: user_id
                }:
                condition
            }
        )(condition);
        const user = await User.findOne(transformedCondition).populate("mission").exec();
        if(!user){
            throw new Error("no user");
        }
        const connections = await getConnections({expired: true});

        const followingsPromise = mergeConnections(
            connections
            .map(
                (connectionDocument)=>{
                    const {connections, validAt, expiredAt} = connectionDocument;
                    const myConnection = connections.find(
                        ({follower})=>follower===user.user_id
                    );
                    return {
                        start: validAt,
                        end: expiredAt,
                        follower: user.user_id,
                        followee: myConnection?myConnection.followee:null,
                        isValid: connectionDocument.isValidAt()
                    }
                }
            )
        )
        .map(
            async ({followee: followee_id, start, end, isValid})=>{
                const followee = await User.findById(followee_id);
                if(followee){
                    const {name, col_no, major, schedule} = followee
                    return {
                        name, col_no, major, exit_at: schedule?.exit_at, start, end, isValid
                    }
                }
            }
        );
        const followings = await Promise.all(followingsPromise);
        return {
            user:
                (
                    ({user_id, name, id, col_no, isAdmin, major, schedule, mission})=>{
                        return {
                            user_id,
                            name,
                            id,
                            col_no,
                            major,
                            isAdmin,
                            Following: followings,
                            Schedule: schedule,
                            Mission: mission
                        }
                    }
                )(user),
        };
    }
    catch(error){
        console.log(error);
        return {error};
    }
}

module.exports = getUser;