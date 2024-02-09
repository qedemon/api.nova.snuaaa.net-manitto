const {connect: connectMongo} = require("modules/mongoose");
const {ConnectionDocument} = require("models/mongoDB");
const getNow = require("modules/Utility/getNow");

async function getConnections(include = {}, at=getNow()){
    try{
        await connectMongo();
        const filter = {
        };
        if(!include.deleted){
            filter.$and=[
                {
                    $expr: {
                        $lt: ["$validAt", "$expiredAt"]
                    }
                }
            ];
        }
        if(!include.willBeValid){
            filter.$and = [
                ...filter.$and??[],
                {
                    validAt: {
                        $lte: at
                    }
                }
            ]
        }
        if(!include.expired){
            filter.$and = [
                ...filter.$and??[],
                {
                    expiredAt: {
                        $gt: at
                    }
                }
            ]
        }
        const result = await ConnectionDocument.find(filter).exec();
        console.assert(result.every(
            ({validAt, expiredAt})=>{
                return validAt<expiredAt;
            }
        ))
        return {
            documents: result
        };
    }
    catch(error){
        return {
            error
        }
    }
}

module.exports = getConnections;