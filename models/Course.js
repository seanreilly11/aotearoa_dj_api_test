const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    videos: {
        type: [String],
        default: [],
    },
    thumbnail: {
        type: String,
        default: "",
    },
    difficulty: {
        type: Number,
        default: 0,
    },
    previousCourse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    totalStudents: {
        type: Number,
        default: 0,
    },
    status: {
        type: Number,
        default: 1,
    },
    order: Number,
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    updatedDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Course", courseSchema);
