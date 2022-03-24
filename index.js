const express = require("express");
const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(express.json());

const videos = require("./routes/videos");
const users = require("./routes/users");
const courses = require("./routes/courses");

app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.use("/api/v1/videos", videos);
app.use("/api/v1/users", users);
app.use("/api/v1/courses", courses);

// @desc Root page
// @route GET /
app.get("/", async (req, res) => {
    try {
        return res.status(201).send("<h1>Aotearoa DJ</h1>");
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on ${PORT}`));
