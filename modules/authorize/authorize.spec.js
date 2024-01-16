const authorize = require("./authorize");

test("authorize", async ()=>{
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjIzLCJncmFkZSI6NywibGV2ZWwiOjIsImF1dG9Mb2dpbiI6ZmFsc2UsImlhdCI6MTcwNTQxNzI0MiwiZXhwIjoxNzA1NTAzNjQyfQ.gLP9Uwq_kZCk_bQeNDLCDekjebOi-MAg9uuEmzvjFz4";
    const {authorized, userInfo, error} = await authorize(token);
    expect(authorized).toBe(true);
})