const bcryptjs = require("bcryptjs");
const User = require("../models/User");

// @desc Get all users
// @route GET /api/v1/users
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ lastLogin: -1 });
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ error: error.message });
    }
};

// @desc Get user by ID
// @route GET /api/v1/users/:id
exports.getUserByID = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: "No user found",
            });
        }

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// @desc login user
// @route POST /api/v1/users/login
exports.loginUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (bcryptjs.compareSync(req.body.password, user.password)) {
                const updateUser = await User.updateOne(
                    {
                        _id: user._id,
                    },
                    {
                        $currentDate: {
                            updatedDate: true,
                            lastLogin: true,
                        },
                        $set: { securityKey: generateSecurityKey(false) },
                    }
                );
                const userWithToken = await User.findById(user._id);
                return res.status(200).json({
                    uid: userWithToken._id,
                    token: userWithToken.securityKey,
                });
                // return res.status(200).json({ ...userWithToken._doc, password: undefined });
            } else {
                return res.status(401).json({
                    error: "Not authorised. Incorrect password",
                });
            }
        } else {
            return res.status(404).json({
                error: "User not found",
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};

// @desc login user on console
// @route POST /api/v1/users/adminlogin
exports.loginAdminUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (bcryptjs.compareSync(req.body.password, user.password)) {
                if (user.admin) {
                    const updateUser = await User.updateOne(
                        {
                            _id: user._id,
                        },
                        {
                            $currentDate: {
                                updatedDate: true,
                            },
                            $set: { securityKey: generateSecurityKey(true) },
                        }
                    );
                    const userWithToken = await User.findById(user._id);
                    return res.status(200).json({
                        uid: userWithToken._id,
                        token: userWithToken.securityKey,
                        firstname: userWithToken.firstname,
                    });
                } else
                    return res.status(403).json({
                        error: "Not authorised. Not admin",
                    });
            } else
                return res.status(401).json({
                    error: "Not authorised. Incorrect password",
                });
        } else
            return res.status(404).json({
                error: "User not found",
            });
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};

// @desc Add new user
// @route POST /api/v1/users
exports.registerUser = async (req, res, next) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        User.findOne({ email }, (err, result) => {
            if (result) {
                return res.status(409).json({
                    error: "Email is taken",
                });
            } else {
                const hash = bcryptjs.hashSync(password);
                const user = new User({
                    firstname,
                    lastname,
                    email,
                    password: hash,
                });
                user.save()
                    .then((result) => {
                        return res.status(201).json(result);
                    })
                    .catch((err) => {
                        return res.status(500).json({
                            error: err.message,
                        });
                    });
            }
        });
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

// @desc give user admin right
// @route PATCH /api/v1/users/adminrights
exports.makeUserAdmin = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const userCheck = await User.findById(userId);

        if (!userCheck)
            return res.status(404).json({
                error: "User not found",
            });
        else {
            const user = await User.updateOne(
                {
                    _id: userId,
                },
                {
                    $currentDate: {
                        updatedDate: true,
                    },
                    $set: { admin: true },
                }
            );
            return res.status(200).json(user);
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};

// @desc update user details
// @route PATCH /api/v1/users/:id
exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userCheck = await User.findById(id);

        if (!userCheck)
            return res.status(404).json({
                error: "User not found",
            });
        else {
            const user = await User.updateOne(
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
            return res.status(200).json(user);
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
};

// @desc Get users completed courses and videos
// @route GET /api/v1/users/completed/:id
exports.getUsersCompletedItems = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user)
            return res.status(404).json({
                error: "No user found",
            });

        return res
            .status(200)
            .json({ courses: user.coursesCompleted, videos: user.videosCompleted });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

function generateSecurityKey(isAdmin) {
    var length = isAdmin ? 8 : 16,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i)
        retVal += charset.charAt(Math.floor(Math.random() * n));

    return retVal;
}
