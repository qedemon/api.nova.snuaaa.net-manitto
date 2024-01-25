const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");

(
    async()=>{
        console.log("install test case start");
        
        const {sequelize} = await createSequelize();
        const {User} = defineModels();
        await closeSequelize(sequelize);
    }
)();