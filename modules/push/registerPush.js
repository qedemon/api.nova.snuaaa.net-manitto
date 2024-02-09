const {connect} = require("modules/mongoose");
const {User} = require("models/mongoDB");

async function registerPush(user_id, subscription){
    try{
        await connect();
        const user = await User.findById(user_id);
        if(!user){
            throw new Error(`unregistered user: ${user_id}`)
        }
        return {
            user: await user.set(
                {
                    push: {
                        subscription
                    }
                }
            ).save()
        }
    }
    catch(error){
        return {
            error
        }
    }
}

module.exports = registerPush;