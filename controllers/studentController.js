const Student = require("../models/Student");
const RoomAllocation = require("../models/RoomAllocation");


// CREATE STUDENT PROFILE
const createStudentProfile = async (req, res) => {
    try {

        const {
            studentId,
            phone,
            course,
            semester,
            emergencyContact
        } = req.body;


        // Check required fields
        if (!studentId || !phone || !course || !semester) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }


        // Check if student already exists
        const existingStudent = await Student.findOne({
            $or: [
                { user: req.user.userId },
                { studentId: studentId }
            ]
        });


        if (existingStudent) {
            return res.status(400).json({
                message: "Student profile already exists"
            });
        }


        // Create student profile
        const student = await Student.create({
            user: req.user.userId,
            studentId,
            phone,
            course,
            semester,
            emergencyContact
        });


        res.status(201).json({
            message: "Student profile created successfully",
            student
        });


    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};



// GET MY ROOM
const getMyRoom = async (req, res) => {
    try {

        // Find student using logged-in user's ID
        const student = await Student.findOne({
            user: req.user.userId
        });


        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }


        // Find active room allocation
        const allocation = await RoomAllocation.findOne({
            student: student._id,
            status: "active"
        })
            .populate("room")
            .populate("allocatedBy", "name email");


        // Student doesn't have a room
        if (!allocation) {
            return res.status(404).json({
                message: "No room has been allocated to you"
            });
        }


        // Return room information
        res.status(200).json({
            message: "Room details fetched successfully",

            student: {
                studentId: student.studentId,
                course: student.course,
                semester: student.semester
            },

            room: allocation.room,

            allocatedBy: allocation.allocatedBy,

            allocationDate: allocation.allocationDate
        });


    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};

const getMyProfile = async (req, res) => {
    try {
        const student = await Student.findOne({
            user: req.user.userId
        });

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        res.status(200).json({
            message: "Student profile fetched successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createStudentProfile,
    getMyRoom,
    getMyProfile
};