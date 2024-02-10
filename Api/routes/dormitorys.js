import express from "express";
import { createDormitory, deleteDormitory, getDormitory, getallDormitory, updateDormitory } from "../controller/dormitory.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyToken, createDormitory);

//UPDATE
router.put("/update/:id", verifyToken, updateDormitory);

//DELETE
router.delete("/delete/:id", verifyToken, deleteDormitory);

//GET ID
router.get("/find/:id", getDormitory);

//GET ALL
router.get("/", getallDormitory);


export default router