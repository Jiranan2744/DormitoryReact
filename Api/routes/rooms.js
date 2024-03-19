import express from "express";
import { verifyToken } from "../utils/verifyToken";

const router = express.Router();

//CREATE
router.post("/newroom", verifyToken, createNewRoom);





export default router