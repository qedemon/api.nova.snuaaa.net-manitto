const {connect} = require("modules/mongoose");
const {User} = require("models/mongoDB");
const {getMissionList} = require("modules/mission/module");

async function registerUser(user_info){
    try{
        await connect();
        const user = await User.findById(user_info.user_id);
        if(user){
            throw new Error("alread exists");
        }
        const mission_difficulty = user_info.mission_difficulty;
        const {missions} = await getMissionList({difficulty: mission_difficulty});
        if(!missions?.length){
            throw new Error(`there is no mission with the difficulty ${mission_difficulty}`);
        }
        const selectedMission = missions[
            (
                (min, max)=>{
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
                }
            )(0, missions.length)
        ];
        const regiteredUser = await User.create(
            {
                _id: user_info.user_id,
                name: user_info.name,
                col_no: user_info.col_no===""?"23":user_info.col_no,
                major: user_info.major===""?"아마추어천문학과":user_info.major,
                id: user_info.id,
                schedule: {
                    enter_at: user_info.enter_at,
                    exit_at: user_info.exit_at
                },
                mission: selectedMission._id
            }
        );
        await regiteredUser.populate("mission")
        return {
            user: regiteredUser
        }
    }
    catch(error){
        return {
            error: error
        }
    }
}

module.exports = registerUser;