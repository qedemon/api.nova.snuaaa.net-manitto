const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineUser = require("./User");
const defineConnection = require("./Connection");

test("connection", async ()=>{
    const {sequelize} = await createSequelize();
    const User = defineUser(sequelize, sequelize.Sequelize.DataTypes);
    const Connection = defineConnection(sequelize, sequelize.Sequelize.DataTypes);
    User.belongsToMany(User, {through: Connection, as: "Followers", foreignKey: "followee_id"});
    User.belongsToMany(User, {through: Connection, as: "Followees", foreignKey: "follower_id"});

    const userInfos = [
        {
            user_id: 2,
            name: "A AA",
            id: "aaa",
            col_no: "23"
        },
        {
            user_id: 3,
            name: "B BB",
            id: "bbb",
            col_no: "23"
        }
    ];

    const users = await userInfos.reduce(
        async (last, userInfo)=>{
            const result = await last;
            const {user_id, name, id, col_no} = userInfo;
            const user = await User.findOne({
                where: {
                    user_id
                }
            });
            if(user){
                return [...result, user];
            }
            else{
                const user = await User.create(
                    {
                        user_id, name, id, col_no
                    }
                );
                return [...result, user];
            }
        },
        Promise.resolve([])
    );

    try{
        await users[0].addFollower(users[1], {through: {expired_at: "2024-01-14 21:00:00+09"}});
        const followers = await users[0].getFollowers(
            {
                joinTableAttributes: ['expired_at']
            }
        )
        const valid = followers.filter(({Connection:{expired_at}})=>expired_at===null);
        console.log(valid.map(({name})=>name));
    }
    catch(error){
        console.log(error);
    }
    finally{
        await closeSequelize(sequelize);
    }

})