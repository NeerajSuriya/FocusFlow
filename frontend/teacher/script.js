const socket = io("http://localhost:5000");

// Listen for Updates
socket.on("updateTeacher", (data) => {
    if (data.studentId === "student_1") {
        document.getElementById("student-status").innerText = `Status: ${data.status}`;
        document.getElementById("student-time").innerText = `Engagement Time: ${data.engagementTime}s`;
    }
});
