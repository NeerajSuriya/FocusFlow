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

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;

// ✅ Define student schema correctly
const studentSchema = new mongoose.Schema({
    studentId: String,
    engagementLogs: [{ timestamp: Date, engaged: Boolean }],
});

// ✅ Fix model overwrite issue
const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

// Store student engagement data
let studentEngagement = {};

// ✅ Merge all `io.on("connection", socket => { ... })` into one
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Chat Messages
    socket.on("chatMessage", (chatData) => {
        console.log("Message received:", chatData);
        io.emit("chatMessage", chatData);
    });

    // Student Engagement Tracking
    socket.on("studentEngagement", ({ studentId, isLooking }) => {
        console.log(`Student ${studentId} engagement: ${isLooking ? "Active" : "Inactive"}`);
        io.emit("updateEngagement", { studentId, isLooking });
    });

    // Student Activity Logs
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

    // Engagement Update & Save to DB
    socket.on("engagementUpdate", async (data) => {
        io.emit("engagementAlert", data);

        await Student.findOneAndUpdate(
            { studentId: data.studentId },
            { $push: { engagementLogs: { timestamp: new Date(), engaged: data.engaged } } },
            { upsert: true }
        );
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

app.get('/get-engagement-logs', (req, res) => {
    const logs = [
        { student: "John Doe", engagementLevel: "High", timestamp: "2025-03-07 14:00" },
        { student: "Jane Smith", engagementLevel: "Medium", timestamp: "2025-03-07 14:05" }
    ];
    res.json(logs);
});

async function fetchEngagementLogs() {
    try {
        const response = await fetch("http://localhost:5000/get-engagement-logs"); // Ensure the correct backend URL
        if (!response.ok) throw new Error("Failed to fetch logs");

        const logs = await response.json();
        console.log("Logs received:", logs); // Debugging log

        // Clear previous logs before updating
        const historyList = document.getElementById("engagementHistory");
        historyList.innerHTML = "";

        logs.forEach(log => {
            const listItem = document.createElement("li");
            listItem.textContent = `${log.student} - ${log.engagementLevel} at ${log.timestamp}`;
            historyList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching logs:", error);
    }
}


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
