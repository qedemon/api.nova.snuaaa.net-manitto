const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineConnection = require("models/Connection");

async function getConnections(follower_id=null, followee_id=null, include_expired=false, loadedSequelize=null){
    const sequelize = await(loadedSequelize?loadedSequelize: (await createSequelize()).sequelize);
    const DataTypes = sequelize.Sequelize.DataTypes;

    const Connection = defineConnection(sequelize, DataTypes);
    const User = Connection.User;
    try{
        const connections = await Connection.findAll(
            {
                include: [
                    {
                        model: User,
                        as: "Follower",
                        attributes: ["user_id"]
                    },
                    {
                        model: User,
                        as: "Followee",
                        attributes: ["user_id"]
                    }
                ],
                where: 
                {
                    ...(follower_id)?{
                        '$Follower.user_id$': follower_id,
                    }:{},
                    ...(followee_id)?{
                        '$Followee.user_id$': followee_id,
                    }:{},
                    ...(include_expired?{}:{expired_at: null})
                }
            }
        );
        return {
            connections: connections,
            Connection
        }
    }
    catch(error){
        return {error};
    }
    finally{
        if(loadedSequelize===null){
            //closeSequelize(sequelize);
        }
    }

}

module.exports = getConnections;