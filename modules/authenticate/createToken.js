const jwt = require("jsonwebtoken");

function createToken(user){
    const secretKey = process.env.JWT_SECRET_KEY;
    const options = {
        expiresIn: "7d"
    };
    const {user_id: _id, col_no, name} = user;
    return jwt.sign({_id, col_no, name}, secretKey, options);
}

module.exports = createToken;