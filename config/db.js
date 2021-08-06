const mongoose = require("mongoose");
const keys = require("./keys");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(keys.MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB connected`);
        // console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
