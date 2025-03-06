const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    studentId: String,
    engagementTime: Number,
    status: String,
});

module.exports = mongoose.model("Student", studentSchema);
