const Course = require("../models/Course");
const Video = require("../models/Video");
const utils = require("./utils");

// @desc Get all courses
// @route GET /api/courses
exports.getCourses = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        const { accessLevel } = req.query;
        const filter = accessLevel == 1 ? {} : { status: utils.isActive() };
        const courses = await Course.find(filter).sort({ status: 1, createdDate: 1 }); // active ones on top sorted by date

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
        const { accessLevel } = req.query;
        const filter =
            accessLevel == 1 ? { courseId: id } : { courseId: id, status: utils.isActive() };

        const course = await Course.findById(id);
        const videos = await Video.find(filter).sort({ status: 1, createdDate: 1 });

        if (!course)
            return res.status(404).json({
                error: "No course found",
            });

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
            const messages = Object.values(err.errors).map((val) => val.message);
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

// TODO: fix this. Need to understand what it's actually for
// @desc increment students count of course
// @route PATCH /api/v1/courses/enrol?courseId=:courseId&userId=:userId
exports.addStudentToCourse = async (req, res, next) => {
    try {
        const { courseId, userId } = req.query;
        const user = await User.findById(userId);
        const courseCheck = await Course.findById(courseId);

        if (!user || !courseCheck)
            return res.status(404).json({
                error: "Course or user not found",
            });
        else if (user.coursesCompleted.includes(courseId))
            return res.status(403).json({
                error: "User already enrolled in course",
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
                    $push: { coursesCompleted: courseId },
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

// @desc remove course
// @route PATCH /api/v1/courses/remove/:id
exports.removeCourse = async (req, res, next) => {
    try {
        const { id: courseId } = req.params;
        const courseCheck = await Course.findById(courseId);

        if (!courseCheck)
            return res.status(404).json({
                error: "Course not found",
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
                    $set: { status: 2 },
                }
            );
            const videos = await Video.updateMany(
                {
                    courseId: courseId,
                },
                {
                    $currentDate: {
                        updatedDate: true,
                    },
                    $set: { status: 2 },
                }
            );
            return res.status(200).json(true);
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};
