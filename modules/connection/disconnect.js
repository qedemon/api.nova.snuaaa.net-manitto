const {createSequelize, closeSequelize} = require("modules/sequelize");
const getConnections = require("./getConnections");
const Result = require("modules/Utility/Result");

async function disconnect(follower_id, followee_id, loadedSequelize=null){
    const sequelize = await(loadedSequelize?loadedSequelize: (await createSequelize()).sequelize);

    try{
        const {connections, error, Connection} = await getConnections(follower_id, followee_id, true, sequelize);
        if(error)
            throw error;
        if(!(connections?.length)){
            return {
                result: Result.fail,
                message: "never connected"
            }  
        }
        
        const valid_connections = connections.filter(({expired_at})=>(expired_at===null));
        const disconnected = await Connection.update(
            {
                expired_at: sequelize.Sequelize.fn("NOW"),
            },
            {
                where: {
                    id: valid_connections.map(({id})=>id)
                }
            }
        )
        return {
            result: Result.success,
            disconnected: disconnected||[]
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

module.exports = disconnect;