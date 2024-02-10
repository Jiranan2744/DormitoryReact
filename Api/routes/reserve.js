import express from "express";
import { createReservation } from "../controller/reserve.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE
router.post("/", verifyToken, createReservation);