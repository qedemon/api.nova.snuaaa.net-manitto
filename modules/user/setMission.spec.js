const setMission = require("./setMission");
const {getUser} = require("modules/user/module");

test("setMission", async ()=>{
    const {user} = await getUser({user_id: 4});
    const prev_mission_id = user.Mission.mission_id;
    const {user: setMissionUser, error} = await setMission(user.user_id, 3);
    if(error){
        throw error;
    }
    expect(setMissionUser.mission.mission_id).toBe(3);
    await setMission(user.user_id, prev_mission_id);
});