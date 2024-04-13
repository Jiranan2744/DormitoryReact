import express from "express";
import { createDormitory, createNewRoom, deleteDormitory, getDormitory, getDormitoryReserve, getDormitoryReserveDelete, getOptionSelect, getOptions, getRoomType, getallDormitory, saveOptions, saveStatus, updateDormitory } from "../controller/dormitory.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//สร้างหอพัก
router.post("/", verifyToken, createDormitory);

//สร้างประเภทห้องพัก
router.post("/newroom", verifyToken, createNewRoom);

router.get("/viewRoomType", verifyToken, getRoomType);

//UPDATE
router.put("/update/:id", verifyToken, updateDormitory);

//DELETE
router.delete("/delete/:id", verifyToken, deleteDormitory);

//GET ID
router.get("/find/:id", getDormitory);

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