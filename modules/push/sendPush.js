const {createSequelize, closeSequelize} = require("modules/sequelize");
const defineModels = require("models");
const getVAPIDKey = require("./getVAPIDKey");
const webpush = require("web-push");

async function sendPush(user_id, data, loadedSequelize = null){
    const sequelize = loadedSequelize || (await createSequelize()).sequelize;
    const Sequelize = sequelize.Sequelize;
    const {DataTypes} = Sequelize;
    const {User, Push} = defineModels(sequelize, DataTypes);
    try{
        const user = await User.findOne(
            {
                where: {
                    user_id
                },
                include: [
                    Push
                ]
            }
        );
        if(!user){
            throw new Error("unregistred user");
        }
        const push = user.Push;
        if(push){
            const subscription = JSON.parse(push.subscription);
            //console.log(subscription);
            const key = getVAPIDKey();
            const options = {
                TTL: 24*60*60,
                vapidDetails: {
                    subject: "https://manitto.snuaaa.net:9889",
                    publicKey: key.public,
                    privateKey: key.private
                }
            };
            const error = webpush.sendNotification(subscription, JSON.stringify(data), options);
            console.log(error);
            return {
                pushed: [data]
            };
        }
        else{
            return {
                pushed: []
            }
        }
    }
    catch(error){
        return {
            error
        }
    }
    finally{
        if(loadedSequelize===null){
            closeSequelize(sequelize);
        }
    }
}

module.exports = sendPush;