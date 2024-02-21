import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { deleteUser, getAllUsers } from "../controller/admin.js";

const router = express.Router();

router.get("/users", verifyToken, getAllUsers);

//Delete users
router.delete("/deleteuser/:id", verifyToken, deleteUser);

export default router