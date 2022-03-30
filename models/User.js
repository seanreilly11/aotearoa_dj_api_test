const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phone: String,
    password: {
        type: String,
        required: true,
        trim: true,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Number,
        default: 1,
        // required: true,
    },
    videosCompleted: Array,
    coursesCompleted: Array,
    school: String,
    securityKey: String,
    goals: String,
    decksUsed: {
        type: String,
        trim: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: Date,
    lastLogin: Date,
    // awards: [awardSchema],
    // userSettings: Settings,
});

module.exports = mongoose.model("User", userSchema);
