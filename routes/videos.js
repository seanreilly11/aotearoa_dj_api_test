const express = require("express");
const router = express.Router();
const {
    getVideos,
    getVideosUnrestricted,
    getVideoByID,
    addVideo,
    getVideosByCourse,
    viewVideo,
    removeVideo,
    updateVideo,
} = require("../controllers/videos");

router.route("/").get(getVideos).post(addVideo);

router.route("/unrestricted").get(getVideosUnrestricted);

router.route("/:id").get(getVideoByID).patch(updateVideo);

router.route("/courses/:id").get(getVideosByCourse);

router.route("/view").patch(viewVideo);

router.route("/remove").patch(removeVideo);

module.exports = router;
