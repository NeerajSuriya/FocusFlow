const teacherSocket = io("http://localhost:5000");

const studentVideoFeed = document.getElementById("student-video-feed");
const engagementList = document.getElementById("engagement-list");
const chatBox = document.getElementById("chatBox");

// 📌 Receive Student Video Streams
teacherSocket.on("studentVideo", ({ studentId, video }) => {
    console.log(`🎥 Receiving video from ${studentId}`);

    const blob = new Blob([video], { type: "video/webm" });
    const videoURL = URL.createObjectURL(blob);
    studentVideoFeed.src = videoURL;
});

// 📌 Receive Engagement Updates from Students
teacherSocket.on("engagementUpdate", ({ studentId, engaged }) => {
    console.log(`📩 Engagement update received: ${studentId} - ${engaged ? "Engaged" : "Not Engaged"}`);

    // Update UI (Red border if disengaged, green if engaged)
    let studentVideo = document.getElementById(`student-${studentId}`);
    if (studentVideo) {
        studentVideo.style.border = engaged ? "2px solid green" : "5px solid red";
    }

    // Update Engagement List
    let studentEntry = document.getElementById(`engagement-${studentId}`);
    if (!studentEntry) {
        studentEntry = document.createElement("p");
        studentEntry.id = `engagement-${studentId}`;
        engagementList.appendChild(studentEntry);
    }
    studentEntry.textContent = `${studentId} - ${engaged ? "Engaged" : "Not Engaged"}`;
});

// 📌 Receive Chat Messages
teacherSocket.on("chatMessage", (data) => {
    chatBox.innerHTML += `<p><strong>${data.sender}:</strong> ${data.message}</p>`;
});

// 📌 Fetch Engagement Logs
async function fetchEngagementLogs() {
    try {
        const response = await fetch("http://localhost:5000/get-engagement-logs"); // ✅ Corrected endpoint
        if (!response.ok) throw new Error("Failed to fetch logs");

        const logs = await response.json();
        console.log("Logs received:", logs); // Debugging

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
