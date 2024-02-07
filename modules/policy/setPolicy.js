const {connect} = require("modules/mongoose");
const {Policy} = require("models/mongoDB");

async function setPolicies(policies){
    try{
        await connect();
        await Policy.updateOne({}, policies, {upsert: true});
        return {
            policies: (await Policy.findOne({})).distributables()
        }
    }
    catch(error){
        return {
            error
        }
    }
}

module.exports = setPolicies;