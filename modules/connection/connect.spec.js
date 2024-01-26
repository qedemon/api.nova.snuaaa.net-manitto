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
                    user_id: 2264
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
        const prevFollowee = user.Following[0].followee_id;
        await disconnect(2264, prevFollowee, sequelize);
        await connect(2264, prevFollowee, sequelize);
    }
    catch(error){
        console.error(error);
        throw error;
    }
    finally{
        await closeSequelize(sequelize);
    }

});