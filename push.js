const {connect, disconnect} = require("modules/mongoose");
const {User} = require("models/mongoDB");

const [node, src, id, message] = process.argv;
console.log(`To ${id}: ${message}`);
async function run(){
    await connect();
    const user = await User.find(
        {
            id
        }
    )
    console.log(user);
    await disconnect();
}
run();