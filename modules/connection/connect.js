const {createSequelize, closeSequelize} = require("modules/sequelize");
const getConnections = require("./getConnections");
const disconnect = require("./disconnect");
const Result = require("modules/Utility/Result");

async function connect(follower_id, followee_id, loadedSequelize=null){
    const sequelize = await(loadedSequelize?loadedSequelize: (await createSequelize()).sequelize);

    try{
        const {connections, error, Connection} = await getConnections(follower_id, followee_id, false, sequelize);
        if(error)
            throw error;
        if(connections?.length>0){
            return {
                result: Result.fail,
                connected: connections[0],
                message: "already connected"
            }  
        }
        const User = Connection.User;
        const follower = await User.findOne(
            {
                where: {
                    user_id: follower_id
                }
            }
        );
        if(!follower){
            throw new Error("no follower")
        }
        const followee = await User.findOne(
            {
                where:{
                    user_id: followee_id
                }
            }
        )
        if(!followee){
            throw new Error("no followee")
        }
        
        const disconnected = [
            ...((await disconnect(follower_id, null, sequelize)).disconnected)||[],
            ...((await disconnect(null, followee_id, sequelize)).disconnected)||[]
        ];

        const connection = await follower.createFollowing();
        await connection.setFollowee(followee);

        return {
            connected: connection,
            disconnected
        }
    }
    catch(error){
        return {error};
    }
    finally{
        if(loadedSequelize === null){
            //closeSequelize(sequelize);
        }
    }

}

module.exports = connect;