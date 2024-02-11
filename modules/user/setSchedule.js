const {connect} = require("modules/mongoose");
const {User} = require("models/mongoDB");

async function setSchedule(user_id, schedule){
    try{
        const user = await User.findById(user_id);
        if(!user){
            throw new Error(`no user with user_id ${user_id}`)
        }
        return {
            user:
            (
                ({user_id, name, col_no, major, schedule:{enter_at, exit_at}})=>{
                    return {
                        user_id, name, col_no, major,
                        schedule: {
                            enter_at, exit_at
                        }
                    }
                }
            )(await user.set({
                schedule: {
                    ...user.schedule,
                    ...schedule
                }
            }).save())
        };
    }
    catch(error){
        return {
            error
        };
    }
}

module.exports = setSchedule;