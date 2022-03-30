const express = require("express");
const router = express.Router();
const {
    getUsers,
    getUserByID,
    registerUser,
    makeUserAdmin,
    updateUser,
    loginUser,
    loginAdminUser,
} = require("../controllers/users");

router.route("/").get(getUsers).post(registerUser);

router.route("/:id").get(getUserByID).patch(updateUser);

router.route("/adminrights").patch(makeUserAdmin);

router.route("/login").post(loginUser);

router.route("/adminlogin").post(loginAdminUser);

module.exports = router;
