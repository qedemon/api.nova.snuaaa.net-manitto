const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");

async function setPolicies(name, value, loadedSequelize = null){
    const sequelize = loadedSequelize || (await createSequelize()).sequelize;
    const Sequelize = sequelize.Sequelize;
    try{
        const {Policy} = defineModels(sequelize, Sequelize.DataTypes);
        const [updated] = await Policy.update(
            {
                value: value.toString()
            },
            {
                where: {
                    name: name
                }
            }
        )
        if(updated<1){
            throw new Error("update policy error");
        }
        const policy = await Policy.findOne(
            {
                where: {
                    name: name
                }
            }
        );

        return {
            policy: (
                ({name, value})=>{
                    return {
                        name, value:eval(value)
                    }
                }
            )(policy)
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

module.exports = setPolicies;