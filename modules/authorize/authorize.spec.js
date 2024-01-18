const authorize = require("./authorize");

test("authorize", async ()=>{
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjIzLCJncmFkZSI6NywibGV2ZWwiOjIsImF1dG9Mb2dpbiI6dHJ1ZSwiaWF0IjoxNzA1NTM3MDM2LCJleHAiOjE3MDY3NDY2MzZ9.I80cpLQvP8Em46tyKthdF_6g7kw7osy7ocxSkKsYizs";
    const {authorized, userInfo, origin, error} = await authorize(token);
    expect(authorized).toBe(true);
})