const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModel = require("models");
const {convertDateToUnit, convertUnitToDate} = require("modules/Utility/convertDate");
const getNow = require("modules/Utility/getNow");
const connect = require("./connect");

async function validateConnection(loadedSequelize=null, today = convertDateToUnit(getNow()).major){
    const sequelize = loadedSequelize || (await createSequelize()).sequelize;
    try{
        const {User, Connection} = defineModel(sequelize, sequelize.Sequelize.DataTypes);
        const willBeValidated = await Connection.findAll(
            {
                where: {
                    willBeValid: today
                }
            }
        );
        const currentValid = (
            await Connection.findAll(
                {
                }
            )
        ).filter(({isValid})=>isValid);
        
        toBeConnected = willBeValidated.filter(
            (will)=>{
                const notUpdated = currentValid.find(
                    (current)=>{
                        return (will.follower_id === current.follower_id) && (will.followee_id === current.followee_id);
                    }
                );
                return !notUpdated;
            }
        )

        await (
            toBeConnected.reduce(
                async (last, {follower_id, followee_id})=>{
                    await last;
                    await connect(follower_id, followee_id, sequelize);
                },
                Promise.resolve()
            )
        )
        await (
            willBeValidated.reduce(
                async (last, connection)=>{
                    await last;
                    await connection.destroy();
                },
                Promise.resolve()
            )
        );

        return {
            toBeConnected: toBeConnected.map(({follower_id, followee_id})=>{return {follower_id, followee_id}})
        }
    }
    catch(error){
        return {
            error
        }
    }
    finally{
        if(loadedSequelize === null){
            await closeSequelize(sequelize);
        }
    }
}

module.exports = validateConnection;