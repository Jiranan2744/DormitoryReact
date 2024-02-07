import User from "../modals/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
    try {

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt)

        const newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            password: hash,
        })

        await newUser.save()
        res.status(200).send("Registered successfully.")
    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {

        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return next(createError(404, "User not found!"))
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
        if (!isPasswordCorrect) {
            return next(createError(400, "Invalid password"));
        }

        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT);
        const { password, isAdmin, ...otherDetails } = user._doc;
        const expiryDate = new Date(Date.now() + 3600000); //token 1 hour
        res
            .cookie("access_token", token, {
                httpOnly: true, expires: expiryDate
            })
            .status(200)
            .json({ ...otherDetails });
    } catch (error) {
        next(error)
    }
};

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
    } catch (error) {
        next(error);
    }
};