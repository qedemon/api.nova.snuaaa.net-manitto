const authorize = require("./authorize");

test("authorize", async ()=>{
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjIzLCJncmFkZSI6NywibGV2ZWwiOjIsImF1dG9Mb2dpbiI6ZmFsc2UsImlhdCI6MTcwNTMzNTY3NCwiZXhwIjoxNzA1NDIyMDc0fQ.Ya1uRzLkTTrG3GAAU3ZpcsyKd8QblsqqOwk6b2XhTfk";
    const {authorized, userInfo, error} = await authorize(token);
    console.log(userInfo);
    console.log(error);
    expect(authorized).toBe(true);
})