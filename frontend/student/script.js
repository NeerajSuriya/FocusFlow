const socket = io("http://localhost:5000");
let studentId = "student_1"; // Change dynamically if needed
let engagementTime = 0;
let isActive = true;

// Track Engagement Time
setInterval(() => {
    engagementTime++;
    sendEngagementData();
}, 1000);

// Detect Activity (Mouse & Keyboard)
function logActivity() {
    isActive = true;
    sendEngagementData();
}

document.addEventListener("mousemove", logActivity);
document.addEventListener("keydown", logActivity);
document.addEventListener("click", logActivity);

// Send Engagement Data to Server
function sendEngagementData() {
    socket.emit("studentActivity", {
        studentId,
        engagementTime,
        status: isActive ? "Active" : "Inactive",
    });
}

// Webcam Access & Video Streaming
const video = document.getElementById("student-video");
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        video.srcObject = stream;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                socket.emit("studentVideo", { studentId, video: event.data });
            }
        };
        mediaRecorder.start(1000); // Send video every 1 sec
    })
    .catch((error) => console.error("Webcam error:", error));

// Chat Functionality
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("chat-send");

function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        socket.emit("chatMessage", {
            sender: studentId,
            message,
            timestamp: new Date().toLocaleTimeString(),
        });
        chatInput.value = "";
    }
}

// Send Message on Enter Key
chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});

sendButton.addEventListener("click", sendMessage);

// Receive & Display Messages
socket.on("chatMessage", ({ sender, message, timestamp }) => {
    const msgElement = document.createElement("p");
    msgElement.innerHTML = `<strong>${sender}</strong> [${timestamp}]: ${message}`;
    chatMessages.appendChild(msgElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Face Tracking using face-api.js
import * as faceapi from 'face-api.js';
let isLooking = true;
let inactiveTime = 0;

// Load face detection models
async function loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
}

// Check if student is looking at the camera
async function detectFace(video) {
    const detection = await faceapi.de
}