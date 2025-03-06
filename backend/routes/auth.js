const express = require("express");
const router = express.Router();
const Student = require("../models/User");

// ✅ Add a new student
router.post("/add-student", async (req, res) => {
    try {
        const { studentId } = req.body;

        if (!studentId) {
            return res.status(400).json({ error: "Student ID is required" });
        }

        // Check if student already exists
        let student = await Student.findOne({ studentId });

        if (student) {
            return res.status(409).json({ error: "Student already exists" });
        }

        student = new Student({ studentId });
        await student.save();
        res.status(201).json({ message: "Student added successfully", student });

    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Get student status
router.get("/student/:id", async (req, res) => {
    try {
        const student = await Student.findOne({ studentId: req.params.id });

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({ student });

    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Update student engagement time
router.put("/update-engagement/:id", async (req, res) => {
    try {
        const { engagementTime } = req.body;

        if (typeof engagementTime !== "number" || engagementTime < 0) {
            return res.status(400).json({ error: "Invalid engagement time" });
        }

        const student = await Student.findOneAndUpdate(
            { studentId: req.params.id },
            { $inc: { engagementTime } },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({ message: "Engagement time updated", student });

    } catch (error) {
        console.error("Error updating engagement:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Delete a student
router.delete("/delete-student/:id", async (req, res) => {
    try {
        const student = await Student.findOneAndDelete({ studentId: req.params.id });

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({ message: "Student deleted successfully" });

    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
