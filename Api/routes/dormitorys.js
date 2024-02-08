import express from "express";
import Dormitory from "../modals/Dormitory.js";
import { createError } from "../utils/error.js";
import { createDormitory, deleteDormitory, getDormitory, getallDormitory, updatedDormitory } from "../controller/dormitory.js";
import { verifyAdmin, verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyToken, createDormitory);

//UPDATE
router.put("/update/:id", verifyToken, updatedDormitory);

//DELETE
router.delete("/delete/:id", verifyToken, deleteDormitory);

//GET ID
router.get("/find/:id", getDormitory);

//GET ALL
router.get("/", getallDormitory);

//GET DORMITORY+ROOM
// router.get("/room/:id", verifyToken, getDormitoryRooms);


export default router