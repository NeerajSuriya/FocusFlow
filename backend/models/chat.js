const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    sender: String,
    message: String,
    timestamp: String
});

module.exports = mongoose.model("Chat", ChatSchema);
