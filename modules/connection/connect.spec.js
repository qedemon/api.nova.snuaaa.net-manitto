const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");
const connect = require("./connect");
const disconnect = require("./disconnect");

test("connect", async ()=>{
    const {sequelize} = await createSequelize();
    const {User, Connection} = defineModels(sequelize, sequelize.Sequelize.DataTypes);

    try{
        const user = await User.findOne(
            {
                where: {
                    user_id: 2565
                },
                include: [
                    {
                        model: Connection,
                        as: "Following",
                        where: {
                            expired_at: null
                        }
                    }
                ]
            }
        );
        //const prevFollowee = user.Following[0].followee_id;
        //await disconnect(2264, prevFollowee, sequelize);
        const {connected, disconnected, error} = await disconnect(2565, 3097, sequelize);
        console.log(connected, disconnected, error);
        if(error){
            throw error;
        }
    }
    catch(error){
        console.error(error);
        throw error;
    }
    finally{
        await closeSequelize(sequelize);
    }

});