import express from "express";
import { createReservation, deleteReservationById, getCustomerBooking, getDormitoryCustomers, viewReservation, viewReservationById } from "../controller/reservation.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE user กดจอง เเล้วสถานะเปลี่ยนเป็นลูกค้า
router.post("/reserve", verifyToken, createReservation);

//Get reservation ดูการจองทั้งหมด
router.get("/viewreservation", verifyToken, viewReservation);

//ดูไอดีการจอง
router.get("/viewreservation/:reservationId", verifyToken, viewReservationById);

//ลบการจอง
router.delete("/reservations/:reservationId", deleteReservationById);

//GET ลูกค้าดูหอพักที่ตัวเองกดจอง
router.get("/reserve/customer/:userId", verifyToken, getCustomerBooking);

//GET หอพักดูว่ามีลูกค้า
router.get("/reserve/owner/:dormitoryId", verifyToken, getDormitoryCustomers);




export default router