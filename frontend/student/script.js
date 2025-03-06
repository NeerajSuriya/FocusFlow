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
