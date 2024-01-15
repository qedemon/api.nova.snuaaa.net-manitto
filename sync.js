const {createSequelize, closeSequelize} = require("modules/sequelize");
const models = require("models");

const run = async ()=>{
    const {sequelize, error} = await createSequelize();
    if(error){
        console.error(error);
        return;
    }
    await Promise.all(
        models.map(
            async ({model})=>{
                const Model = model(sequelize, sequelize.Sequelize.DataTypes);
                await Model.sync();
            }
        )
    )
    await closeSequelize(sequelize);
}

run();