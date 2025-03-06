const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const routes = require("./routes");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use("/api", routes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;

// Store student engagement data
let studentEngagement = {};

// Handle socket connections
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Chat Message Handling
    socket.on("chatMessage", (chatData) => {
        console.log("Message received:", chatData);
        io.emit("chatMessage", chatData);
    });

    // Student Engagement Tracking
    socket.on("studentActivity", (data) => {
        studentEngagement[data.studentId] = {
            engagementTime: data.engagementTime,
            status: data.status,
        };
        io.emit("updateEngagement", { studentId: data.studentId, ...studentEngagement[data.studentId] });
    });

    // Video Streaming
    socket.on("studentVideo", (data) => {
        console.log(`Receiving video from ${data.studentId}`);
        io.emit("studentVideo", data);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("studentEngagement", ({ studentId, isLooking }) => {
        console.log(`Student ${studentId} engagement: ${isLooking ? "Active" : "Inactive"}`);
        io.emit("updateEngagement", { studentId, isLooking });
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Listen for student engagement data
    socket.on("studentEngagement", ({ studentId, isLooking }) => {
        console.log(`Engagement update: ${studentId} - ${isLooking ? "Looking" : "Not Looking"}`);
        io.emit("updateEngagement", { studentId, isLooking }); // Notify teacher
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});



server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
