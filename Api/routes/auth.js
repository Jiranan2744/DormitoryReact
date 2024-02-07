import express from "express";
import { register } from "../controller/auth.js";
import { login } from "../controller/auth.js";
import { signOut } from "../controller/auth.js";

const router = express.Router();

router.post("/register", register )

router.post("/login", login )

router.get("/signout", signOut)

export default router