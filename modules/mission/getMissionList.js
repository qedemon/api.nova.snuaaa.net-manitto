const {connect} = require("modules/mongoose");
const {Mission} = require("models/mongoDB");

async function getMissionList(filter={}){
    try{
        await connect();
        const missions = (await Mission.find(filter).populate("nUsers"))
        .map(
            ({_id, title, difficulty, description, maximum, nUsers})=>{
                return {
                    _id, title, difficulty, description, maximum,
                    nUsers
                }
            }
        )
        return {
            missions: missions||[],
        }
    }
    catch(error){
        return {
            error
        }
    }
}

module.exports = getMissionList;