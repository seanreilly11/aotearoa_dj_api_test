const Course = require("../models/Course");
const Video = require("../models/Video");

// @desc Get all courses
// @route GET /api/courses
exports.getCourses = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        const courses = await Course.find();
        return res.status(200).json(courses);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// @desc Get course by ID
// @route GET /api/courses/:id
exports.getCourseByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        const videos = await Video.find({
            courseId: id,
            status: { $ne: 2 },
        });

        if (!course) {
            return res.status(404).json({
                error: "No course found",
            });
        }

        return res.status(200).json({ ...course._doc, videos });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// @desc Add new course
// @route POST /api/courses
exports.addCourse = async (req, res, next) => {
    try {
        const course = await Course.create(req.body);

        return res.status(201).json(course);
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

// @desc update course details
// @route PATCH /api/courses/:id
exports.updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const courseCheck = await Course.findById(id);

        if (!courseCheck)
            return res.status(404).json({
                error: "Course not found",
            });
        else {
            const course = await Course.updateOne(
                {
                    _id: id,
                },
                {
                    $currentDate: {
                        updatedDate: true,
                    },
                    $set: req.body,
                }
            );
            return res.status(200).json(course);
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};

// @desc increment students count of course
// @route PATCH /api/v1/courses/enrol
exports.addStudentToCourse = async (req, res, next) => {
    try {
        const { courseId, userId } = req.body;
        const user = await User.findById(userId);
        const courseCheck = await Course.findById(courseId);

        if (!user || !courseCheck)
            return res.status(404).json({
                error: "Video or user not found",
            });
        else if (user.coursesCompleted.includes(courseId))
            return res.status(403).json({
                error: "Video already viewed by user",
            });
        else {
            const course = await Course.updateOne(
                {
                    _id: courseId,
                },
                {
                    $currentDate: {
                        updatedDate: true,
                    },
                    $inc: { totalStudents: 1 },
                }
            );
            const updatedUser = await User.updateOne(
                {
                    _id: userId,
                },
                {
                    $currentDate: {
                        updatedDate: true,
                    },
                    $push: { videosCompleted: courseId },
                }
            );
            return res.status(200).json(video);
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};
