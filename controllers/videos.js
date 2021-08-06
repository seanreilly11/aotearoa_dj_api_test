const Video = require("../models/Video");
const Course = require("../models/Course");
const User = require("../models/User");

// @desc Get all videos
// @route GET /api/v1/videos
exports.getVideos = async (req, res, next) => {
    try {
        const videos = await Video.find({ status: { $ne: 2 } });

        return res.status(200).json({
            count: videos.length,
            data: videos,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// @desc Get all videos despite status
// @route GET /api/v1/videos/unrestricted
exports.getVideosUnrestricted = async (req, res, next) => {
    try {
        const videos = await Video.find();
        return res.status(200).json({
            count: videos.length,
            data: videos,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// @desc Get video by ID
// @route GET /api/v1/videos/:id
exports.getVideoByID = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                error: "No video found",
            });
        }

        return res.status(200).json({
            data: video,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// @desc Get video by course
// @route GET /api/v1/videos/courses/:id
exports.getVideosByCourse = async (req, res, next) => {
    try {
        const videos = await Video.find({ courseId: req.params.id });

        if (!videos) {
            return res.status(404).json({
                error: "No video found",
            });
        }

        return res.status(200).json({
            data: videos,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// @desc Add new video
// @route POST /api/v1/videos/
exports.addVideo = async (req, res, next) => {
    try {
        const video = await Video.create(req.body);
        const course = await Course.updateOne(
            {
                _id: req.body.courseId,
            },
            { $push: { videos: video._id } }
        );

        return res.status(201).json({
            data: video,
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
                error: err.message,
            });
        }
    }
};

// @desc increment view count of video
// @route PATCH /api/v1/videos/view
exports.viewVideo = async (req, res, next) => {
    try {
        const { videoId, userId } = req.body;
        const user = await User.findById(userId);
        const videoCheck = await Video.findById(videoId);

        if (!user || !videoCheck)
            return res.status(404).json({
                error: "Video or user not found",
            });
        else if (user.videosCompleted.includes(videoId))
            return res.status(403).json({
                error: "Video already viewed by user",
            });
        else {
            const video = await Video.updateOne(
                {
                    _id: videoId,
                },
                {
                    $currentDate: {
                        updatedDate: true,
                    },
                    $inc: { views: 1 },
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
                    $push: { videosCompleted: videoId },
                }
            );
            return res.status(200).json({
                data: video,
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};

// @desc remove video
// @route PATCH /api/v1/videos/remove
exports.removeVideo = async (req, res, next) => {
    try {
        const { videoId } = req.body;
        const videoCheck = await Video.findById(videoId);

        if (!videoCheck)
            return res.status(404).json({
                error: "Video not found",
            });
        else {
            const video = await Video.updateOne(
                {
                    _id: videoId,
                },
                {
                    $currentDate: {
                        updatedDate: true,
                    },
                    $set: { status: 2 },
                }
            );
            return res.status(200).json({
                data: video,
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};

// @desc update video
// @route PATCH /api/v1/videos/:id
exports.updateVideo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const videoCheck = await Video.findById(id);

        if (!videoCheck)
            return res.status(404).json({
                error: "Video not found",
            });
        else {
            const video = await Video.updateOne(
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
            return res.status(200).json({
                data: video,
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};
