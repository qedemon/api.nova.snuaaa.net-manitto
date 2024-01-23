const setMission = require("./setMission");

test("setMission", async()=>{
    const {error, user_id, mission_id} = await setMission(4, 2);
    if(error){
        console.error(error);
        throw error;
    }
    expect(user_id).toBe(4);
    expect(mission_id).toBe(2);
});