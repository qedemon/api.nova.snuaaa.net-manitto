const {connect: connectMongo} = require("modules/mongoose");
const {ConnectionDocument, Mission, User} = require("models/mongoDB");
const getNow = require("modules/Utility/getNow");

async function getConnections(include = {}, at=getNow()){
    try{
        await connectMongo();
        const filter = {
        };
        if(!include.willBeValid){
            filter.validAt = {
                $lte: at
            }
        }
        if(!include.expired){
            filter.expiredAt = {
                $gt: at
            }
        }
        const result = await ConnectionDocument.find(filter).exec();
        console.assert(result.every(
            ({validAt, expiredAt})=>{
                return validAt<=expiredAt;
            }
        ))
        return result;
    }
    catch(error){
        return {
            error
        }
    }
}

module.exports = getConnections;