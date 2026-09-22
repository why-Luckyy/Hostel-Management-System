const express=require("express")
const router=express.Router()

const authMiddleware=require("../middleware/authMiddleware");
const wardenMiddleware = require("../middleware/wardenMiddleware");


const {getMyWardenProfile, getMyHostelStudents}=require("../controllers/wardenController");

router.get(
    "/me",
    authMiddleware,
    wardenMiddleware,
    getMyWardenProfile
);

router.get(
    "/students",
    authMiddleware,
    wardenMiddleware,
    getMyHostelStudents
);

module.exports = router;