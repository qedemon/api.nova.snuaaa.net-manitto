const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("./index");
const defineConnection = require("./Connection");
const defineMission = require("./Mission");

test("connection", async ()=>{
    const {sequelize} = await createSequelize();
    const {Connection, User} = defineModels(sequelize, sequelize.Sequelize.DataTypes);
    await User.sync({alter: true});
    await Connection.sync({alter: true});

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

test("mission", async()=>{
    const {sequelize} = await createSequelize();
    const DataTypes = sequelize.Sequelize.DataTypes;
    const {Mission, User} = defineModels(sequelize, DataTypes);
    await Mission.sync({alter: true});
    await User.sync({alter: true});
    try{
        const missionInfo = [
            {
                title: "테스트 미션 첫번째",
                description: "알아서 해라",
                maximum: 10,
                difficulty: 1
            },
            {
                title: "테스트 미션 두번째",
                description: "한번 더 알아서 해라",
                maximum: 20,
                difficulty: 2
            },
            {
                title: "테스트 미션 세번째",
                description: "다시 알아서 해라",
                maximum: 10,
                difficulty: 3
            }
        ];
    
        const missions = await missionInfo.reduce(
            async (last, missionInfo)=>{
                const result = await last;
                const [mission, created] = await Mission.findOrCreate(
                    {
                        where: missionInfo
                    }
                )
                return [...result, ...(mission?[mission]:[])];
            },
            Promise.resolve([])
        )
        expect(missions.length).toBe(missionInfo.length);
    }
    catch(error){
        console.error(error);
        throw error;
    }
    finally{
        await closeSequelize(sequelize);
    }
});

test("policy", async()=>{

});