const createToken = require("./createToken");
const authenticate = require("./authenticate");

test("createToken", async ()=>{
    const {user} = await authenticate("first user", "23", "aaa1234");
    const token = createToken(user);
    console.log(token);
})