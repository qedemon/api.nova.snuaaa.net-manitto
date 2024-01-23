const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");

async function getUser(condition, loadedSequelize=null){
    const {sequelize} = await (loadedSequelize || createSequelize());
    const {Sequelize:{Op}} = sequelize;
    const Models = defineModels(sequelize, sequelize.Sequelize.DataTypes);
    const User = Models.User;
    const Connection = Models.Connection;
    const Schedule = Models.Schedule;
    const Mission = Models.Mission;
    try{
        const user = await User.findOne(
            {
                include: [
                    {
                        model: Connection,
                        as: "Following",
                        attributes: ["expired_at"],
                        include: {
                            model: User,
                            as: "Followee",
                            attributes: ["name", "col_no", "major"]
                        },
                    },
                    {
                        model: Schedule
                    },
                    {
                        model: Mission,
                        attributes: [
                            "title", "description", "difficulty"
                        ]
                    }
                ],
                where: condition,
            }
        )
        return {
            user:
                (
                    ({user_id, name, id, col_no, isAdmin, major, Following, Schedule, Mission})=>{
                        return {
                            user_id,
                            name,
                            id,
                            col_no,
                            major,
                            isAdmin,
                            following: Following.map(
                                ({Followee: {name, col_no, major}, expired_at})=>{
                                    return {name, col_no, major, expired_at};
                                }
                            ),
                            schedule: {
                                enter_at: Schedule?.enter_at,
                                exit_at: Schedule?.exit_at
                            },
                            mission: {
                                title: Mission.title,
                                rank: Mission.difficulty,
                                description: Mission.description
                            }
                        }
                    }
                )(user)
        };
    }
    catch(error){
        return {error};
    }
    finally{
        if(loadedSequelize === null)
            await closeSequelize(sequelize);
    }
}

module.exports = getUser;