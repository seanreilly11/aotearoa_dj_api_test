const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const connectDB = require("./config/db");
// const upload = require("./middlewares/multer");
// const Video = require("./models/Video");
// const Course = require("./models/Course");

connectDB();

const app = express();

app.use(express.static("client_console"));
app.use(compression());
app.use(helmet());
app.use(express.json());
// app.use(
//     express.urlencoded({
//         limit: "50mb",
//         extended: true,
//         parameterLimit: 100000,
//     })
// );
app.use(cors());

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

// route to add new video is here as I can't link it with the middleware in the routes file
// @desc Add new video
// @route POST /api/v1/videos/
// app.post("/api/v1/videos", upload.single("uploaded_file"), async (req, res) => {
//     try {
//         const videoData = { ...req.body, videoURI: req.file.path };
//         const video = await Video.create(videoData);
//         const course = await Course.updateOne(
//             {
//                 _id: req.body.courseId,
//             },
//             { $push: { videos: video._id } }
//         );

//         return res.status(201).json(video);
//     } catch (err) {
//         console.log("failed");
//         console.log(err.name);
//         console.log(err.message);
//         if (err.name === "ValidationError") {
//             const messages = Object.values(err.errors).map(
//                 (val) => val.message
//             );
//             return res.status(400).json({
//                 error: messages,
//             });
//         } else {
//             return res.status(500).json({
//                 error: err.message,
//             });
//         }
//     }
// });
