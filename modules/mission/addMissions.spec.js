const {connect} = require("modules/mongoose");
const {Mission} = require("models/mongoDB");

test("addMissions", async()=>{
    try{
        await connect();
        await Promise.all(
            [
                {
                    "_id": 40,
                    "title": "마니또가 좋아하는 선물주기",
                    "description": "마니또가 좋아하는 선물주기",
                    "difficulty": 2,
                    "maximum": 10
                },
                {
                    "_id": 41,
                    "title": "마니또 스트레칭 시키기",
                    "description": "마니또 스트레칭 시키기",
                    "difficulty": 3
                }
            ].map(
                async (mission)=>{
                    await Mission.create(mission);
                }
            )
        );
    }
    catch(error){
        console.log(error);
    }
});