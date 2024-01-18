require("dotenv").config();
const fetch = require("node-fetch");

const remoteAPIHost = process.env.REMOTE_API_HOST;

async function authenticate(id, password){
    const data = {id, password, autoLogin: true};
    const options = {
        method: "POST",
        mode: "cors",
        chache: "no-chache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(data)
    }
    try{
        const res = await fetch(`${remoteAPIHost}/api/auth/login/`, options);
        const {sucess, userInfo, token, message} = await res.json();
        if(sucess){
            return {authenticated:sucess, userInfo, token};
        }
        else{
            throw new Error(message);
        }
    }
    catch(error){
        return {authenticated:false, error};
    }
}

module.exports = authenticate;