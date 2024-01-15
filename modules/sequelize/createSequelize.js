require("dotenv").config();
const { Sequelize } = require("sequelize");

async function createSequelize(){
    const {DB_DIALECT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME} = process.env;
    const sequelize = new Sequelize(`${DB_DIALECT}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {logging: true});
    try{
        return {
            sequelize
        };
    }
    catch(error){
        return {
            error
        }
    }
}

module.exports = createSequelize;