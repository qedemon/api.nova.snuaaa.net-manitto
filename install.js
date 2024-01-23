const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");

(
    async()=>{
        console.log("install start");
        const {sequelize} = await createSequelize();
        const Sequelize = sequelize.Sequelize;
        const {User, Connection, Schedule, Mission, Policy} = defineModels(sequelize, Sequelize.DataTypes);
        await [User, Connection, Schedule, Mission].reduce(
            async (last, model)=>{
                await last;
                console.log(model);
                return await model.sync({alter: true});
            },
            Promise.resolve()
        );
        await Policy.sync({force: true});
        await Policy.destroy(
            {
                truncate: true
            }
        );
        
        const policy_info = [
            {
                name: "SHOW_FOLLOWEE",
                value: false,
            },
            {
                name: "SHOW_FOLLOWER",
                value: false
            }
        ];
        await Policy.bulkCreate(policy_info);
        console.log("Policy");

        
        closeSequelize(sequelize);
        console.log("install complete");
    }
)();