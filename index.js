const express = require("express");
const connectDB = require("./config/db");

connectDB();

const app = express();
app.use(express.json());
app.use(express.static("./index.html"));

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on ${PORT}`));
