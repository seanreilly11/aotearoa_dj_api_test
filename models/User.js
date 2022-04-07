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
        default: "",
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
        default: "",
    },
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
    },
    videosCompleted: {
        type: [String],
        default: [],
    },
    coursesCompleted: {
        type: [String],
        default: [],
    },
    school: {
        type: String,
        default: "",
    },
    securityKey: {
        type: String,
        default: "",
    },
    goals: {
        type: String,
        default: "",
    },
    decksUsed: {
        type: String,
        trim: true,
        default: "",
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    // awards: [awardSchema],
    // userSettings: Settings,
});

module.exports = mongoose.model("User", userSchema);
