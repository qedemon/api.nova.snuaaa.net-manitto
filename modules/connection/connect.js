const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");
const disconnect = require("./disconnect");

async function connect(follower_id, followee_id, loadedSequelize=null, options={}){
    const sequelize = loadedSequelize || (await createSequelize()).sequelize;
    const Sequelize = sequelize.Sequelize;

    try{
        const {User, Connection} = defineModels(sequelize, Sequelize.DataTypes);
        const connection = ((flag)=>(flag===null || flag===undefined))(options.willBeValid)?
            (
                await Connection.findAll(
                    {
                        where:{
                            follower_id,
                        },
                        include:[
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
            ).find(({isValid})=>isValid):
            (
                await Connection.findOne(
                    {
                        where:{
                            follower_id,
                            willBeValid: options.willBeValid
                        },
                        include:[
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
            );
        if(connection?.Followee?.user_id===followee_id){
            return {
                connected: [],
                disconnected: []
            }
        }
        const follower = await User.findOne(
            {
                where: {
                    user_id: follower_id
                }
            }
        )
        if(!follower){
            throw (`invalid follower ${follower_id}`);
        }
        const followee = await User.findOne(
            {
                where: {
                    user_id: followee_id
                }
            }
        );
        if(!followee){
            throw (`invalid followee ${followee_id}`);
        }
        const {disconnected, error} = connection?(await disconnect(connection.follower_id, connection.followee_id, sequelize, options)):{disconnected:[]};
        if(error){
            throw error;
        }
        const newConnection = await follower.createFollowing(
            {
                willBeValid: options.willBeValid??null
            }
        );
        await newConnection.setFollowee(followee);
        return {
            connected: [{follower_id, followee_id, willBeValid: options.willBeValid}],
            disconnected
        }
    }
    catch(error){
        return {
            error
        };
    }
    finally{
        if(loadedSequelize === null){
            closeSequelize(sequelize);
        }
    }

}

module.exports = connect;