socket.on("previousMessages", (messages) => {
    messages.forEach(({ sender, message, timestamp }) => {
        const msgElement = document.createElement("p");
        msgElement.innerHTML = `<strong>${sender}</strong> [${timestamp}]: ${message}`;
        chatMessages.appendChild(msgElement);
    });
});
