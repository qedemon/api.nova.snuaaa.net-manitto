const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");


async function getAllUser(loadedSequelize=null){
    const sequelize = (loadedSequelize || (await createSequelize()).sequelize);
    const Models = defineModels(sequelize, sequelize.Sequelize.DataTypes);
    const User = Models.User;
    const Connection = Models.Connection;
    const Mission = Models.Mission;
    try{ 
        const users = await User.findAll(
            {
                where: {
                    isAdmin: false
                },
                attributes: [
                    'user_id',
                    'name',
                    'col_no',
                    'major',
                ],
                include: [
                    {
                        model: Mission,
                        attributes: ["title", "description", "difficulty"]
                    },
                    {
                        model: Connection,
                        as: "Following",
                        attributes: ["expired_at"],
                        include: {
                            model: User,
                            as: "Followee",
                            attributes: ["user_id", "name", "col_no", "major"],
                            include: Mission
                        }
                    },
                    {
                        model: Connection,
                        as: "Followed",
                        attributes: ["expired_at"],
                        include: {
                            model: User,
                            as: "Follower",
                            attributes: ["user_id", "name", "col_no", "major"],
                            include: Mission
                        }
                    },
                ]
            }
        )

        const filterUser = ({user_id, name, col_no, major})=>{
            return {
                user_id, name, col_no, major
            }
        };
        const filterMission = ({title, description, difficulty})=>{
            return {
                title, description, difficulty
            };
        };
        const filterConnection = ({connection, user})=>{
            return {
                user_info: filterUser(connection[user]),
                expired_at: connection.expired_at
            }
        };
        return {
            users: users.map(
                (user)=>{
                    const mission = (
                        (mission)=>{
                            return mission?filterMission(mission):{};
                        }
                    )(user.Mission);
                    const [following, followed] = [{connections: user.Following, user: "Followee"}, {connections: user.Followed, user: "Follower"}].map(
                        ({connections, user})=>{
                            return connections?connections.map((connection)=>{return {connection, user}}).map(filterConnection):[];
                        }
                    )
                    return {
                        ...filterUser(user),
                        mission,
                        following,
                        followed
                    }
                }
            )
        }
    }
    catch(error){
        return {error};
    }
    finally{
        if(loadedSequelize === null)
            await closeSequelize(sequelize);
    }
}

module.exports = getAllUser;