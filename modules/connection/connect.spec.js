const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineUser = require("models/User");
const connect = require("./connect");
const disconnect = require("./disconnect");
const Result = require("modules/Utility/Result");

test("connect", async ()=>{
    const {sequelize} = await createSequelize();
    const User = defineUser(sequelize, sequelize.Sequelize.DataTypes);
    const userInfos = [
        {
            name: "testA",
            id: "testA",
            col_no: "23"
        },
        {
            name: "testB",
            id: "testB",
            col_no: "23"
        },
        
        {
            name: "testC",
            id: "testC",
            col_no: "23"
        }
    ];

    const users = await userInfos.reduce(
        async (last, userInfo)=>{
            const result = await last;
            const {name, id, col_no} = userInfo;
            const users = await User.findOrCreate({
                where: {
                    name, id, col_no
                }
            });
            return [...result, users[0]];
        },
        Promise.resolve([])
    );

    try{
        connect_info = [
            {follower: users[0], followee: users[1]},
            {follower: users[1], followee: users[2]},
            {follower: users[2], followee: users[0]},

            {follower: users[1], followee: users[0]},
            {follower: users[2], followee: users[1]},
            {follower: users[0], followee: users[2]},
            
        ]
        const results = await connect_info.reduce(
            async (last, {follower, followee})=>{
                const results = await last;
                return await connect(follower.user_id, followee.user_id, sequelize);
            },
            Promise.resolve([])
        )
        /*
        const {result, message, connected, error} = await connect(users[0].user_id, users[1].user_id, sequelize);

        if(error){
            console.error(error);
            throw (error);
        }
        else{
            if(result === Result.fail){
                console.log(message);
            }
            await disconnect(connected.follower_id, connected.followee_id, sequelize);
        }*/
    }
    catch(error){
        console.error(error);
        throw error;
    }
    finally{
        await closeSequelize(sequelize);
    }

});