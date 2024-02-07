const mongoose = require("mongoose");

const PolicySchema = new mongoose.Schema(
    {
        SHOW_FOLLOWEE: Boolean,
        SHOW_FOLLOWER: Boolean
    },
    {
        methods: {
            distributables(){
                return {
                    SHOW_FOLLOWEE: this.SHOW_FOLLOWEE,
                    SHOW_FOLLOWER: this.SHOW_FOLLOWER
                }
            }
        }
    }
)

const Policy = mongoose.model("Policy", PolicySchema);

module.exports = Policy;