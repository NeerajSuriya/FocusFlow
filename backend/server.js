const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const routes = require("./routes");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(express.json());
app.use("/api", routes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;

// Handle socket.io connections
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Listen for chat messages
    socket.on("chatMessage", (chatData) => {
        console.log("Message received:", chatData);
        io.emit("chatMessage", chatData); // Broadcast to all users
    });

    // Receive student video and forward to teacher
    socket.on("studentVideo", ({ studentId, video }) => {
        console.log(`Received video from student ${studentId}`);
        io.emit("teacherVideo", { studentId, video });
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
