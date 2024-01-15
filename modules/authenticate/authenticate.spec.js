const authenticate = require("./authenticate");

test("authenticate", async ()=>{
    const {error, authenticated} = await authenticate("first user", "23", "aaa1234");
    console.log(error);
    expect((!error)&&authenticated).toBe(true);
});