const express = require("express");
const router = express.Router();
const {
    getCourses,
    getCourseByID,
    addCourse,
} = require("../controllers/courses");

router.route("/").get(getCourses).post(addCourse);

router.route("/:id").get(getCourseByID);

module.exports = router;
