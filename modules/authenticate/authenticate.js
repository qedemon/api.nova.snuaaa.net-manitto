const userModule = require("modules/user/module");
const bcrypt= require("bcrypt");

async function authenticate(name, col_no, password){
    try{
        const {user} = await userModule.getUser({name, col_no});
        const authenticated = await bcrypt.compare(password, user.password);
        return {authenticated, user};
    }
    catch(error){
        return {error};
    }
}

module.exports = authenticate;