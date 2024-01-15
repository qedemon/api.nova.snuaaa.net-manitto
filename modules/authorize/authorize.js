require("dotenv").config();
const fetch = require("node-fetch");

const remoteAPIHost = process.env.REMOTE_API_HOST;
async function authorize(token){
    const options = {
        method: "GET",
        mode: "cors",
        chache: "no-chache",
        credentials: "same-origin",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    }
    try{
        const res = await fetch(`${remoteAPIHost}/api/userinfo`, options);
        const {success, CODE, userInfo} = await res.json();
        if(success){
            return {
                authorized: true,
                userInfo
            }
        }
        else{
            throw new Error(CODE);
        }
    }
    catch(error){
        return {
            authorized: false,
            error
        }
    }
}

module.exports = authorize;