import express from "express";
import {  deleteRoom, updatedRoom, getRoom, getallRoom, createNewRoom } from "../controller/room.js"
import { verifyAdmin, verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
// router.post("/:dormitoryid", verifyAdmin, createRoom);
router.post("/", verifyAdmin, createNewRoom);

//UPDATE
router.put("/update/:id", verifyToken, updatedRoom);

//DELETE
router.delete("/:id/:dormitoryid", verifyAdmin, deleteRoom);

//GET ID
router.get("/find/:id", getRoom);

//GET ALL
router.get("/", getallRoom);



export default router