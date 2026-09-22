const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createStudentProfile,
    getMyRoom,
    getMyProfile
} = require("../controllers/studentController");


// CREATE STUDENT PROFILE
router.post(
    "/profile",
    authMiddleware,
    createStudentProfile
);


// GET MY ROOM
router.get(
    "/my-room",
    authMiddleware,
    getMyRoom
);

router.get("/me", authMiddleware, getMyProfile);


module.exports = router;