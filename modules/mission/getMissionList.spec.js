const getMissionList = require("./getMissionList");

test("getMissionList", async()=>{
    const {error, missions} = await getMissionList();
    if(error){
        console.error(error);
        throw error;
    }
    expect(missions.length).toBe(3);
});