const mongoose = require("mongoose");
const getNow = require("modules/Utility/getNow");

const ConnectionSchema = new mongoose.Schema(
    {
        _id: false,
        follower: {
            type: Number,
            ref: "User"
        },
        followee: {
            type: Number,
            ref: "User"
        },
    },
    {
        versionKey : false 
    }
)
const ConnectionDocumentSchema = new mongoose.Schema(
    {
        connections: [ConnectionSchema],
        validAt: Date,
        expiredAt: Date,
    },
    {
        methods: {
            isValidAt(at=getNow()){
                return this.validAt<=at && at<this.expiredAt;
            },
            isExpiredAt(at=getNow()){
                return this.expiredAt>=at;
            },
            willBeValidAt(at=getNow()){
                return this.validAt>at;
            }
        }
    }
)
const ConnectionDocument = mongoose.model("ConnectionDocument", ConnectionDocumentSchema);

module.exports = ConnectionDocument;