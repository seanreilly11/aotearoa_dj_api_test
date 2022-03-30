const express = require("express");
const router = express.Router();
const {
    getCourses,
    getCourseByID,
    addCourse,
    updateCourse,
} = require("../controllers/courses");

router.route("/").get(getCourses).post(addCourse);

router.route("/:id").get(getCourseByID).patch(updateCourse);

module.exports = router;
