import bcryptjs from 'bcryptjs';
import { createError } from '../utils/error.js';
import User from "../modals/User.js";
import Dormitory from "../modals/Dormitory.js";

export const updatedUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
        return next(createError(401, 'You can only update your own account!'));
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: req.body.password,
                    phone: req.body.phone,
                },
            },
            { new: true }
        );
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
};



export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
    return next(createError(401, 'You can only delete your own account!'));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json("User has been deleted.")

    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        res.status(200).json(user)

    } catch (err) {
        next(err);
    }
}

//GET OWNER+DORMITORY
export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const dormitorys = await Dormitory.find({ userRef: req.params.id });
            res.status(200).json(dormitorys);
        } catch (error) {
            next(error);
        }
    } else {
        return next(createError(401, 'You can only view your own listings!'));
    }
};

//เจ้าของหอพัก เปิด-ปิด สถานะหอพัก
export const toggleDormitoryStatus = async (req, res, next) => {
    try {
        const dormitory = await Dormitory.findById(req.params.dormitoryId);

        if (!dormitory) {
            return next(createError(404, 'Dormitory not found!'));
        }

        dormitory.active = !dormitory.active;

        dormitory.isReservationEnabled = !dormitory.isReservationEnabled;

        await dormitory.save();

        res.status(200).json({ message: 'Dormitory status updated successfully.' });
    } catch (error) {
        next(error);
    }
};

//ดูผู้ใช้งานทั้งหมด
export const getallUser = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);

    } catch (error) {
        next(error);
    }
}
