const socket = io("http://localhost:5000");
let studentId = "student_1"; // Unique ID for each student
let engagementTime = 0;
let isActive = true;

// Track Time
setInterval(() => {
    engagementTime++;
    sendData();
}, 1000);

// Log Activity
function logActivity() {
    isActive = true;
    sendData();
}

// Detect Mouse & Keyboard
document.addEventListener("mousemove", logActivity);
document.addEventListener("keydown", logActivity);
document.addEventListener("click", logActivity);

// Send Data to Server
function sendData() {
    socket.emit("studentActivity", {
        studentId,
        engagementTime,
        status: isActive ? "Active" : "Inactive",
    });
}

// Webcam Access
const video = document.getElementById("student-video");
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                socket.emit("studentVideo", { studentId, video: event.data });
            }
        };
        mediaRecorder.start(1000);
    })
    .catch(error => console.error("Error accessing webcam:", error));

// Chat Functionality
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("chat-send");

// Send Message with Sender Info and Timestamp
function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        const timestamp = new Date().toLocaleTimeString();
        const chatData = { sender: studentId, message, timestamp };
        socket.emit("chatMessage", chatData);
        chatInput.value = "";
    }
}

// Send Message on Enter Key Press
chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

sendButton.addEventListener("click", sendMessage);

// Receive and Display Chat Messages
socket.on("chatMessage", ({ sender, message, timestamp }) => {
    const msgElement = document.createElement("p");
    msgElement.innerHTML = `<strong>${sender}</strong> [${timestamp}]: ${message}`;
    chatMessages.appendChild(msgElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Handle Disconnect
socket.on("disconnect", () => {
    console.log("Disconnected from server");
});
const teacherSocket = io("http://localhost:5000");

const studentVideoFeed = document.getElementById("student-video-feed");

teacherSocket.on("studentVideo", ({ studentId, video }) => {
    console.log(`Receiving video from ${studentId}`);

    const blob = new Blob([video], { type: "video/webm" });
    const videoURL = URL.createObjectURL(blob);
    studentVideoFeed.src = videoURL;
});

const engagementList = document.getElementById("engagement-list");

teacherSocket.on("updateEngagement", ({ studentId, engagementTime, status }) => {
    let studentEntry = document.getElementById(`engagement-${studentId}`);
    
    if (!studentEntry) {
        studentEntry = document.createElement("p");
        studentEntry.id = `engagement-${studentId}`;
        engagementList.appendChild(studentEntry);
    }

    studentEntry.textContent = `${studentId} - ${status}, Engaged for ${engagementTime}s`;
});
