// Ensure this line only appears once
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    role: { type: String, required: true, enum: ["student", "teacher"] },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model("User", UserSchema);
const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    engagementTime: {
        type: Number,
        default: 0, // ✅ Default engagement time is 0
        min: 0 // ✅ Prevent negative engagement time
    }
}, { timestamps: true }); // ✅ Auto-add createdAt & updatedAt

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
