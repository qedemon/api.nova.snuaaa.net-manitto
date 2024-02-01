const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");

async function getUser(condition, loadedSequelize=null){
    const sequelize = (loadedSequelize || (await createSequelize()).sequelize);
    const Models = defineModels(sequelize, sequelize.Sequelize.DataTypes);
    const User = Models.User;
    const Connection = Models.Connection;
    const Schedule = Models.Schedule;
    const Mission = Models.Mission;
    try{
        const users = await User.findAll(
            {
                include: [
                    {
                        model: Connection,
                        as: "Following",
                        include: {
                            model: User,
                            as: "Followee",
                            attributes: ["name", "col_no", "major"],
                            include: [
                                Schedule
                            ]
                        },
                    },
                    {
                        model: Schedule
                    },
                    {
                        model: Mission,
                        attributes: [
                            ["id", "mission_id"], "title", "description", "difficulty"
                        ]
                    }
                ],
                where: condition,
            }
        )
        const [user] = users;
        
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
                                ({Followee, expired_at, isValid})=>{
                                    if(Followee){
                                        const {name, col_no, major, Schedule} = Followee;
                                        return {name, col_no, major, expired_at, isValid, exit_at: Schedule?.exit_at};
                                    }
                                    else{
                                        return undefined;
                                    }
                                }
                            ),
                            Schedule,
                            Mission
                        }
                    }
                )(user),
            users
        };
    }
    catch(error){
        console.error(error);
        return {error};
    }
    finally{
        if(loadedSequelize === null)
            await closeSequelize(sequelize);
    }
}

module.exports = getUser;