const userModule = require("./module");
const bcrypt = require("bcrypt");

test('createUser', async ()=>{
    const name = "first user";
    const password = await (
        new Promise(
            (resolve, reject)=>{
                bcrypt.hash("aaa1234", 10, (error, encryptedPW)=>{
                    if(error)
                        reject(error);
                    else
                        resolve(encryptedPW);
                });
            }
        )
    );
    const col_no = "23";
    const user = {
        name, password, col_no
    };
    const {user: result, error} = await userModule.createUser(user);
    expect(
        (!(error)) && (Object.keys(user).every((key)=>{
            return user[key]===result[key];
        }))
    ).toBe(true);
});

test('getUser', async()=>{
    const name = "first user";
    const col_no = "23";
    const {user, error} = await userModule.getUser({name, col_no});
    const compare = await bcrypt.compare("aaa1234", user.password);
    expect(compare).toBe(true);
})