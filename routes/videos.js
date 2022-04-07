const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const {
    getVideos,
    addVideo,
    getVideoByID,
    getVideosByCourse,
    viewVideo,
    removeVideo,
    updateVideo,
    completeVideo,
} = require("../controllers/videos");

router.route("/").get(getVideos).post(addVideo);

router.route("/complete").patch(completeVideo);

router.route("/:id").get(getVideoByID).patch(updateVideo);

router.route("/courses/:id").get(getVideosByCourse);

router.route("/view/:id").patch(viewVideo);

router.route("/remove/:id").patch(removeVideo);

module.exports = router;
