const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");
const getNow = require("modules/Utility/getNow");

async function disconnect(follower_id, followee_id, loadedSequelize=null, options={}){
    const sequelize = loadedSequelize||(await createSequelize()).sequelize;

    try{
        const {User, Connection} = defineModels(sequelize, sequelize.Sequelize.DataTypes);
        const connection = (
            await Connection.findAll(
                {
                    where: {
                        follower_id,
                        followee_id
                    },
                    include: [
                        {
                            model: User,
                            as: "Follower"
                        },
                        {
                            model: User,
                            as: "Followee"
                        }
                    ]
                }
            )
        ).find(
            (options.willBeValid===undefined || options.willBeValid===null)?
            ({isValid})=>isValid
            :
            ({willBeValid})=>willBeValid===options.willBeValid
        );
        if(!connection)
            return {
                disconnected: []
            }
        if((options.willBeValid===undefined || options.willBeValid===null)){
            connection.expired_at=getNow();
            await connection.save();
        }
        else{
            await connection.destroy();
        }
        return {
            disconnected: [
                {follower_id, followee_id, willBeValid: options.willBeValid}
            ]
        }
        
    }
    catch(error){
        return {error};
    }
    finally{
        if(loadedSequelize === null){
            closeSequelize(sequelize);
        }
    }

}

module.exports = disconnect;