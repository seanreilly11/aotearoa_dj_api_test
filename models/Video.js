const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    timeLength: Number,
    videoURI: {
        type: String,
        // required: true,TODO:
        trim: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    thumbnail: String,
    difficulty: {
        type: Number,
        default: 0,
    },
    order: Number,
    pageReference: Number,
    views: {
        type: Number,
        default: 0,
    },
    status: {
        type: Number,
        default: 1,
        // required: true, TODO:
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: Date,
});

module.exports = mongoose.model("Video", videoSchema);
