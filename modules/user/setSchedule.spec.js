const {getUser} = require("modules/user/module");
const setSchedule = require("./setSchedule");

test("setSchedule", async()=>{
    const {user} = await getUser({user_id: 4});
    const prevSchedule = user.Schdule;
    const {user: updatedUser, error} = await setSchedule(user.user_id, {
        enter_at: Date.now(),
        exit_at: Date.now()
    });
    if(error){
        throw error;
    }
    await setSchedule(user.user_id, prevSchedule);
});