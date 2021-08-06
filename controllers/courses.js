const Course = require("../models/Course");
const Video = require("../models/Video");

// @desc Get all courses
// @route GET /api/courses
exports.getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find();
        return res.status(200).json({
            count: courses.length,
            data: courses,
        });
    } catch (err) {
        return res.status(500).json({ error: error.message });
    }
};

// @desc Get course by ID
// @route GET /api/courses/:id
exports.getCourseByID = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        const videos = await Video.find({
            courseId: req.params.id,
            status: { $ne: 2 },
        });

        if (!course) {
            return res.status(404).json({
                error: "No course found",
            });
        }

        return res.status(200).json({
            data: { ...course._doc, videos },
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// @desc Add new course
// @route POST /api/courses
exports.addCourse = async (req, res, next) => {
    try {
        const course = await Course.create(req.body);

        return res.status(201).json({
            data: course,
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(
                (val) => val.message
            );
            return res.status(400).json({
                error: messages,
            });
        } else {
            return res.status(500).json({
                error: "Server error",
            });
        }
    }
};
