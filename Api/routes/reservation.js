import express from "express";
import { createReservation, deleteMember, getCustomerBooking, getDormitoryCustomers, viewReservation } from "../controller/reservation.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//CREATE user กดจอง เเล้วสถานะเปลี่ยนเป็นลูกค้า
router.post("/reserve", verifyToken, createReservation);

//Get reservation ดูการจองทั้งหมด
router.get("/viewreservation", verifyToken, viewReservation);

//GET ลูกค้าดูหอพักที่ตัวเองกดจอง
router.get("/reserve/customer/:userId", verifyToken, getCustomerBooking);

//GET หอพักดูว่ามีลูกค้า
router.get("/reserve/owner/:dormitoryId", verifyToken, getDormitoryCustomers);

//DELETE ลบลูกค้าออกจากหอพัก
router.delete("/dormitories/:dormitoryId/customers/:customerId", verifyToken, deleteMember);


export default router