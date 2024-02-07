import express from "express";
import { deleteUser, updatedUser, getallUser, getUser, getUserListings } from "../controller/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// router.get("/checkauthentication", verifyToken, (req, res, next) => {
//     res.send("Hello user, you are logged in")
// })

// //Role User
// router.get("/checkuser/:id", verifyUser, (req, res, next) => {
//     res.send("Hello user, you are logged in and you can delete your account")
// })

// //Role Admin
// router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
//     res.send("Hello admin, you are logged in and you can delete all accounts")
// })


//UPDATE
router.post("/update/:id", verifyToken, updatedUser);

//DELETE
router.delete("/:id", verifyToken, deleteUser);

//GET
router.get("/getuser/:id", verifyUser, getUser);

router.get('/list/:id', verifyToken, getUserListings);

//GET ALL
router.get("/", verifyAdmin, getallUser);


export default router