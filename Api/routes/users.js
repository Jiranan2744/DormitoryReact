import express from "express";
import { deleteUser, updatedUser, getallUser, getUser, getUserListings, toggleDormitoryStatus, getUserRoomTypes, getUserDormitoryAndRoomTypeDetails } from "../controller/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// router.get("/checkauthentication", verifyToken, (req, res, next) => {
//     res.send("Hello user, you are logged in")
// })

// //Role User
// router.get("/checkuser/:id", verifyUser, (req, res, next) => {
//     res.send("Hello user, you are logged in and you can delete your account")
// })

// //Role Admin
// router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
//     res.send("Hello admin, you are logged in and you can delete all accounts")
// })


//เเก้ไขผู้ใช้งาน
router.post("/update/:id", verifyToken, updatedUser);

//ลบผู้ใช้งาน
router.delete("/:id", verifyToken, deleteUser);

//ผู้ใช้งานดูข้อมูลตัวเอง
router.get("/getuser", verifyUser, getUser);

//ดูผู้ใช้งานทั้งหมด
router.get("/", verifyAdmin, getallUser);

//เจ้าของหอพัก ดูหอพักของตัวเอง
router.get('/listing', verifyToken, getUserListings);

//เจ้าของหอพัก ดูประเภทห้องพักของตัวเอง
router.get('/roomtypes', verifyToken, getUserRoomTypes);

//เเสดงข้อมูลหอพัก-ประเภทห้องพักของตัวเอง
router.get('/roomtypeDetails', verifyToken, getUserDormitoryAndRoomTypeDetails);

//open-close
router.put('/status/:dormitoryId', toggleDormitoryStatus);


export default router