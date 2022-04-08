const express = require("express");
const router = express.Router();
const {
    getCourses,
    getCourseByID,
    addCourse,
    updateCourse,
    removeCourse,
} = require("../controllers/courses");

router.route("/").get(getCourses).post(addCourse);

router.route("/:id").get(getCourseByID).patch(updateCourse);

router.route("/remove/:id").patch(removeCourse);

module.exports = router;
