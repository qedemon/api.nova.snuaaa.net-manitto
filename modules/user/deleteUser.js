const {connect} = require("modules/mongoose");
const {User} = require("models/mongoDB");

async function deleteUser(user_id){
    try{
        await connect();
        const destroyed = await User.deleteOne(
            {
                _id: user_id
            }
        );
        if(destroyed<=0){
            throw new Error(`nobody with user_id = ${user_id}`);
        }
        return {
            destroyed
        }
    }
    catch(error){
        return {
            error
        }
    }
}

module.exports = deleteUser;