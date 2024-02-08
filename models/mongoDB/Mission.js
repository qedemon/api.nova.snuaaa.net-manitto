const mongoose = require("mongoose");

const MissionSchema = new mongoose.Schema(
    {
        _id: Number,
        title: String,
        description: String,
        difficulty: Number,
        maximum: Number
    },
    {
        versionKey : false 
    }
);
MissionSchema.virtual("nUsers", {
    ref: "User",
    localField: "_id",
    foreignField: "mission",
    count: true
})

const Mission = mongoose.model("Mission", MissionSchema);

module.exports = Mission;