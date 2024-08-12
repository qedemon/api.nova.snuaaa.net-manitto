const {connect} = require("modules/mongoose");
const {User} = require("models/mongoDB");
const getVAPIDKey = require("./getVAPIDKey");
const webpush = require("web-push");

async function sendPush(user_id, data){
    try{
        const user = await User.findById(user_id);
        const push = user.push;
        if(push){
            const subscription = push.subscription;
            const key = getVAPIDKey();
            const options = {
                TTL: 24*60*60,
                vapidDetails: {
                    subject: "https://manitto.snuaaa.net:8200",
                    publicKey: key.public,
                    privateKey: key.private
                }
            };
            await webpush.sendNotification(subscription, JSON.stringify(data), options);
            console.log(`send ${user_id}:${data}`)
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
}

module.exports = sendPush;