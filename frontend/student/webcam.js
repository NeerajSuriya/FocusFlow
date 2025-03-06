document.addEventListener("DOMContentLoaded", function () {
    console.log("Script Loaded");

    const video = document.getElementById("student-webcam");

    if (!video) {
        console.error("Video element not found!");
        return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log("Requesting webcam access...");
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function (stream) {
                console.log("Webcam access granted");
                video.srcObject = stream;
                video.play();
            })
            .catch(function (err) {
                console.error("Error accessing webcam:", err);
            });
    } else {
        console.error("Webcam not supported in this browser.");
    }
});
