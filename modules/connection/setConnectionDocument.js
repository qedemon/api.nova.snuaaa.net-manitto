const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModel = require("models");
const {convertDateToUnit, convertUnitToDate} = require("modules/Utility/convertDate");
const getNow = require("modules/Utility/getNow");

async function setConnectionDocument(day, data, loadedSequelize, today=convertDateToUnit(getNow()).major){
    const sequelize = loadedSequelize || (await createSequelize()).sequelize;
    const Sequelize = sequelize.Sequelize;
    const {DataTypes, Op} = Sequelize;
    try{
        return {
            day,
            data
        }
    }
    catch(error){
        console.error(error);
        return {
            error
        }
    }
    finally{
        await closeSequelize(sequelize);
    }
}

module.exports = setConnectionDocument;