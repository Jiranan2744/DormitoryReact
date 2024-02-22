import express from "express";
import {  createDormitory, deleteDormitory, getDormitory, getOptionSelect, getOptions, getallDormitory, saveOptions, saveStatus, updateDormitory } from "../controller/dormitory.js";
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

//GET facilities
router.get("/getOptions", verifyToken, getOptions);

//GET facilities select
router.get("/optionselect/:dormitoryId", verifyToken, getOptionSelect);

//POST facilities
router.post("/saveOptions/:id", verifyToken, saveOptions);

//Post saveStatus
router.get('/:dormitoryId/save-status', verifyToken, saveStatus);


export default router