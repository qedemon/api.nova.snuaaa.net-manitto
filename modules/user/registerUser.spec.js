const registerUser = require("./registerUser");
const deleteUser = require("./deleteUser");

test("registerUser", async()=>{
    const user_info = {
        user_id: 11,
        name: "테스트유저",
        id: "testUser",
        col_no: "09",
        major: "테스트프로그래밍",
        exit_at: "2024-02-03T09:00:00.000Z",
        mission_difficulty: 2
    }
    try{
        const {user, error} = await registerUser(user_info);
        if(error){
            throw error;
        }
        ["user_id", "name", "id", "col_no", "major"].forEach(
            (key)=>{
                expect(user[key]).toBe(user_info[key]);
            }
        );
        expect(user.Mission.difficulty).toBe(user_info.mission_difficulty);
    }
    catch(error){
        console.error(error);
        throw error;
    }
    finally{
        await deleteUser(user_info.user_id);
    }
})