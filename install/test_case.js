const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");
const fs = require("fs");
const path = require("path");
const createRandomUserInfo = require("./testCase/createRandomUserInfo");

(
    async()=>{
        console.log("install test case start");
        
        const {sequelize} = await createSequelize();
        const Sequelize = sequelize.Sequelize;
        const DataTypes = Sequelize.DataTypes;
        const {User, Mission, Schedule} = defineModels(sequelize, DataTypes);

        await Mission.destroy(
            {
                where: {
                }
            }
        );
        const missionInfo = await new Promise((resolve, reject)=>{
            fs.readFile(path.join(__dirname, "testCase", "testMissions.json"), "utf8", (error, data)=>{
                if(error){
                    reject(error);
                    return;
                }
                resolve(JSON.parse(data));
            })
        });
        const missions = await Mission.bulkCreate(missionInfo);

        const userInfo = createRandomUserInfo(50);
        await User.destroy(
            {
                where:{

                }
            }
        );
        const user = await User.bulkCreate(
            userInfo.map(
                (user)=>{
                    const {user_id, id, name, col_no, major} = user;
                    const {schedule} = user;
                    return {
                        user_id, id, name, col_no, major,
                        Schedule: schedule
                    }
                }
            ),
            {
                include: [
                    Schedule
                ]
            }
        )

        console.log(user.length);

        await closeSequelize(sequelize);
    }
)();