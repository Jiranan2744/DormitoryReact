import express from "express";
import { createDormitory, deleteDormitory, getDormitory, getDormitoryReserve, getDormitoryReserveDelete, getOptionSelect, getOptions, getRoomType, getRoomTypesByDormitoryId, getallDormitory, saveOptions, saveStatus, updateDormitory, viewRoom } from "../controller/dormitory.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//สร้างหอพัก
router.post("/", verifyToken, createDormitory);

router.get('/details', verifyToken, viewRoom),

router.get("/viewRoomType", verifyToken, getRoomType);

//UPDATE
router.put("/update/:id", verifyToken, updateDormitory);

//DELETE
router.delete("/delete/:id", verifyToken, deleteDormitory);

//GET ID
router.get("/find/:id", getDormitory); //ดูข้อมูลหอพักทั้งหมด (เช็คจากไอดีหอพัก)


router.get("/view/:dormitoryId", verifyToken, getRoomTypesByDormitoryId)


//หอพัก ดูไอดีการจอง
router.get("/find/reserve/:id", getDormitoryReserve);

//ลบลูกค้าออกจากหอพัก
router.delete("/find/reserve/:id", getDormitoryReserveDelete);

//GET ALL
router.get("/", getallDormitory);

//GET facilities
router.get("/getOptions", verifyToken, getOptions);

//GET facilities select
router.get("/optionselect/:dormitoryId", verifyToken, getOptionSelect);

//POST facilities
router.post("/saveOptions/:id", verifyToken, saveOptions);

//Post saveStatus
router.get('/:dormitoryId/save-status', verifyToken, saveStatus);


export default router