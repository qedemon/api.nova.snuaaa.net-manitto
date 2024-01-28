require("dotenv").config();

function getVAPIDKey(){
    return {
        public: process.env.VAPID_PUBLIC_KEY,
        private: process.env.VAPID_PRIVATE_KEY
    }
}

module.exports=getVAPIDKey;