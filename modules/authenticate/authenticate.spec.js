const authenticate = require("./authenticate");

test("authenticate", async ()=>{
    const {error, authenticated, userInfo, token} = await authenticate("qedemon", "ktskts20");
    expect((!error)&&authenticated).toBe(true);
});