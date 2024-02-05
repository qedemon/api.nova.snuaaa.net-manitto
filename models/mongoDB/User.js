const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema(
    {
        enter_at: {type: Date, required: true},
        exit_at: {type: Date, required: true}
    }
)

const PushSchema = new mongoose.Schema(
    {
        subscription: mongoose.Schema.Types.Mixed
    }
)

const UserSchema = new mongoose.Schema(
    {
        _id: Number,
        name: String,
        col_no: {type: String, default: "23"},
        major: {type: String, default: "아마추어천문학과"},
        schedule: ScheduleSchema,
        mission: {
            type: Number,
            ref: "Mission"
        },
        push: PushSchema
    },
    {
        toJSON: {virtuals: true}
    }
)
UserSchema.virtual("user_id").get(function(){
    return this._id;
});

const User = mongoose.model("User", UserSchema);

module.exports = User;