const {connect, disconnect} = require("modules/mongoose");
const {User} = require("models/mongoDB");
const {sendPush} = require("modules/push/module");

const [node, src, name, message] = process.argv;
console.log(`To ${name}: ${message}`);
async function run(){
    await connect();
    const user = await User.findOne(
        {
            name
        }
    )
    if(!user){
        console.log("no user");
        return;
    }
    const {error} = await sendPush(user._id, {
        title: "관리자로부터",
        body: message
    })
    if(error){
        console.error(error);
    }
    console.log("success");
    await disconnect();
}
run();