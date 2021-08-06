const express = require("express");
const router = express.Router();
const {
    getUsers,
    getUserByID,
    registerUser,
    makeUserAdmin,
    updateUser,
} = require("../controllers/users");

router.route("/").get(getUsers).post(registerUser);

router.route("/:id").get(getUserByID).patch(updateUser);

router.route("/adminrights").patch(makeUserAdmin);

module.exports = router;
