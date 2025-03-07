document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 Script Loaded");

    // ✅ Ensure Socket.io is loaded before using io()
    if (typeof io === "undefined") {
        console.error("❌ Socket.io not loaded. Check script order.");
        return;
    }

    const socket = io("http://localhost:5000");

    // ✅ Webcam setup
    const video = document.getElementById("student-webcam");

    if (!video) {
        console.error("❌ Video element not found!");
        return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("📷 Requesting webcam access...");
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                console.log("✅ Webcam access granted");
                video.srcObject = stream;
                video.play();
            })
            .catch((err) => {
                console.error("❌ Error accessing webcam:", err);
            });
    } else {
        console.error("❌ Webcam not supported in this browser.");
    }

    // ✅ Gaze tracking with WebGazer
    webgazer.setGazeListener((data) => {
        if (!data) return;

        let x = data.x; 
        let screenWidth = window.innerWidth;

        let isEngaged = x > screenWidth * 0.3 && x < screenWidth * 0.7;

        console.log(`👀 Gaze detected at x=${x}, Engagement: ${isEngaged}`);

        // ✅ Send engagement status to server
        socket.emit("engagementUpdate", { studentId: "123", engaged: isEngaged });
    }).begin();
});
