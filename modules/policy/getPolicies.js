const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");

async function getPolicies(loadedSequelize = null){
    const sequelize = loadedSequelize || (await createSequelize()).sequelize;
    const Sequelize = sequelize.Sequelize;
    try{
        const {Policy} = defineModels(sequelize, Sequelize.DataTypes);
        const policies = await Policy.findAll();
        return {
            policies: policies.map(
                ({name, value})=>{
                    return {
                        name,
                        value: eval(value)
                    }
                }
            )
        };
    }
    catch(error){
        return {
            error
        }
    }
    finally{
        if(loadedSequelize === null){
            closeSequelize(sequelize);
        }
    }
}

module.exports = getPolicies;