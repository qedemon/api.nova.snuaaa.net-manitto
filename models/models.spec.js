const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineUser = require("./User");
const defineConnection = require("./Connection");

test("connection", async ()=>{
    const {sequelize} = await createSequelize();
    const Connection = defineConnection(sequelize, sequelize.Sequelize.DataTypes);
    const User = Connection.User;

    const userInfos = [
        {
            name: "A AA",
            id: "aaa",
            col_no: "23"
        },
        {
            name: "B BB",
            id: "bbb",
            col_no: "23"
        }
    ];

    const users = await userInfos.reduce(
        async (last, userInfo)=>{
            const result = await last;
            const {name, id, col_no} = userInfo;
            const user = await User.findOne({
                where: {
                    name, id, col_no
                }
            });
            if(user){
                return [...result, user];
            }
            else{
                const user = await User.create(
                    {
                        name, id, col_no
                    }
                );
                return [...result, user];
            }
        },
        Promise.resolve([])
    );
    const connection = await users[0].createFollowing();
    await connection.setFollowee(users[1]);
    
    await users.reduce(
        async (last, user)=>{
            const result = await last;
            const reloaded = await user.reload(
                {
                    include: [
                        {
                            model: Connection,
                            as: "Following",
                            include: {
                                model: User,
                                as: "Followee"
                            }
                        },
                        {
                            model: Connection,
                            as: "Followed",
                            include: {
                                model: User,
                                as: "Follower"
                            }
                        },
                    ]
                }
            );
            return [...result, reloaded];
        },
        Promise.resolve([])
    );
    
    expect(users[0].Following[0].Followee.user_id).toBe(users[1].user_id);

    await User.destroy(
        {
            where: {
                user_id: users.map(({user_id})=>user_id)
            }
        }
    );
    
    await Connection.destroy(
        {
            where: {
                id: connection.id
            }
        }
    );
    await closeSequelize(sequelize);

})