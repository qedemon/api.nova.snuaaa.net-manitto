const {getUser} = require("modules/user/module");
const setSchedule = require("./setSchedule");

test("setSchedule", async()=>{
    const {user} = await getUser({user_id: 4});
})