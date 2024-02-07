const {connect} = require("modules/mongoose");
const {Policy} = require("models/mongoDB");

async function getPolicies(){
    try{
        await connect();
        const policy = await Policy.findOne().exec();
        console.log(policy);
        return {
            policies: policy.distributables()
        }
    }
    catch(error){
        return {
            error
        }
    }
}

module.exports = getPolicies;