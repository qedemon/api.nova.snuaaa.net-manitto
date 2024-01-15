const {createSequelize, closeSequelize} = require("modules/sequelize");
const models = require("models");

const run = async ()=>{
    const {sequelize, error} = await createSequelize();
    if(error){
        console.error(error);
        return;
    }
    await models.reduce(
            async (last, {model})=>{
                await last;
                const Model = model(sequelize, sequelize.Sequelize.DataTypes);
                await Model.sync({force: true});
            },
            Promise.resolve()
    )
    await closeSequelize(sequelize);
}

run();