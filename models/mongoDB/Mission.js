const mongoose = require("mongoose");

const MissionSchema = new mongoose.Schema(
    {
        _id: Number,
        title: String,
        description: String,
        difficulty: Number
    },
);

const Mission = mongoose.model("Mission", MissionSchema);

module.exports = Mission;