const mongoose = require("mongoose"); // since we are using mongoose we have to require it

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: String,
    videos: [String],
    thumbnail: String,
    difficulty: Number,
    previousCourse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    category: {
        type: String,
        // required: true, TODO:
        trim: true,
    },
    totalStudents: {
        type: Number,
        default: 0,
    },
    status: {
        type: Number,
        default: 1,
        // required: true,
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

module.exports = mongoose.model("Course", courseSchema);
