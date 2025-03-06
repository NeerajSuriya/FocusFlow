const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const Student = require("./models");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/engagement-tracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// API Route for Fetching Student Data
app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// Socket.io for Real-Time Updates
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("studentActivity", async (data) => {
        await Student.findOneAndUpdate(
            { studentId: data.studentId },
            { $set: { engagementTime: data.engagementTime, status: data.status } },
            { upsert: true, new: true }
        );
        io.emit("updateTeacher", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// Start Server
server.listen(5000, () => {
    console.log("Server running on port 5000");
});
