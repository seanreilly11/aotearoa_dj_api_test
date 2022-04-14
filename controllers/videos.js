const Video = require("../models/Video");
const Course = require("../models/Course");
const User = require("../models/User");
const utils = require("./utils");

// @desc Get all videos. Access level 1 returns no filter - should be used for console. No access level returns active status only - app
// @route GET /api/v1/videos
exports.getVideos = async (req, res, next) => {
    try {
        const { accessLevel } = req.query;
        const filter = accessLevel == 1 ? {} : { status: utils.isActive() };
        const videos = await Video.find(filter).sort({ createdDate: 1 });

        return res.status(200).json(videos);
    } catch (err) {
        return res.status(500).json({ error: err.message });
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

        return res.status(200).json(video);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// @desc Add new video
// @route POST /api/v1/videos
exports.addVideo = async (req, res, next) => {
    try {
        const video = await Video.create(req.body);
        const course = await Course.updateOne(
            {
                _id: req.body.courseId,
            },
            { $push: { videos: video._id } }
        );

        return res.status(201).json(video);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// @desc Get video by course. Don't really need as videos are returned with course details
// @route GET /api/v1/videos/courses/:id
exports.getVideosByCourse = async (req, res, next) => {
    try {
        const videos = await Video.find({ courseId: req.params.id });

        if (!videos) {
            return res.status(404).json({
                error: "No video found",
            });
        }

        return res.status(200).json(videos);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// @desc increment view count of video
// @route PATCH /api/v1/videos/view/:id
exports.viewVideo = async (req, res, next) => {
    try {
        const videoId = req.params.id;
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
                    $inc: { views: 1 },
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

// @desc add video id to users videos completed
// @route PATCH /api/v1/videos/complete?videoId=:videoId&userId=:userId
exports.completeVideo = async (req, res, next) => {
    try {
        const { videoId, userId } = req.query;
        const user = await User.findById(userId);
        const videoCheck = await Video.findById(videoId);

        if (!user || !videoCheck)
            return res.status(404).json({
                error: "Video or user not found",
            });
        else if (user.videosCompleted.includes(videoId))
            return res.status(403).json({
                error: "Video already completed by user",
            });
        else {
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
            return res.status(200).json(true);
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};

// @desc remove video
// @route PATCH /api/v1/videos/remove/:id
exports.removeVideo = async (req, res, next) => {
    try {
        const { id: videoId } = req.params;
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
            return res.status(200).json(true);
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
            return res.status(200).json(video);
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};
