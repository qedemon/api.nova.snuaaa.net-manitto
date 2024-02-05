const mongoose = require("mongoose");


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
        }
    }
)
const ConnectionDocumentSchema = new mongoose.Schema(
    {
        connections: [ConnectionSchema],
        validAt: Date,
        expiredAt: Date
    }
)
const ConnectionDocument = mongoose.model("ConnectionDocument", ConnectionDocumentSchema);

module.exports = ConnectionDocument;