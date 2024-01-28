const getPolicies = require("./getPolicies");

function midLayer(){
    return async (req, _, next)=>{
        const {policies, error} = await getPolicies();
        if(error){
            req.policy={error};
        }
        else{
            req.policy={policies};
        }
        next();
    }
}


module.exports = midLayer;