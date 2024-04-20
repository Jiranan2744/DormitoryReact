import bcryptjs from 'bcryptjs';
import { createError } from '../utils/error.js';
import User from "../modals/User.js";
import Dormitory from "../modals/Dormitory.js";
import RoomType from '../modals/RoomType.js';
import Reservation from '../modals/Reservation.js';


//เเก้ไขข้อมูลผู้ใช้ (/)
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

//ลบข้อมูลผู้ใช้ (/)
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

//ผู้ใช้ ดูข้อมูลตัวเอง (/)
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
        res.status(200).json(user)

    } catch (err) {
        next(err);
    }
}

//ดูผู้ใช้ทั้งหมด (/)
export const getallUser = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);

    } catch (error) {
        next(error);
    }
}

//เจ้าของหอพัก ดูข้อมูลหอพักตัวเอง (/)
export const getUserListings = async (req, res, next) => {
    try {
        const dormitories = await Dormitory.find({ userRef: req.user.id });
        res.status(200).json(dormitories);
    } catch (error) {
        next(error);
    }
};





//เจ้าของหอพัก ดูประเภทห้องพักของตัวเอง
export const getUserRoomTypes = async (req, res, next) => {
    try {
        // Get the user ID from the request context
        const userId = req.user.id;

        // Query the RoomType collection for room types associated with the user's ID
        const roomTypes = await RoomType.find({ userRef: userId });

        // Return the room types as a response
        return res.status(200).json({ success: true, roomTypes });
    } catch (err) {
        // Handle errors
        next(err);
    }
};




//เเสดงข้อมูลหอพัก-ประเภทห้องพัก
export const getUserDormitoryAndRoomTypeDetails = async (req, res, next) => {
    try {
        // Get the user ID from the request context
        const userId = req.user.id;

        // Query the Dormitory collection for dormitory documents associated with the user's ID
        const dormitories = await Dormitory.find({ userRef: userId }).populate('facilities');

        // Query the RoomType collection for room type documents associated with the user's ID
        const roomTypes = await RoomType.find({ userRef: userId });

        // Return the dormitory and room type details as a response
        return res.status(200).json({ success: true, dormitories, roomTypes });
    } catch (err) {
        // Handle errors
        next(err);
    }
};




export const toggleDormitoryStatus = async (req, res, next) => {
    try {
        const dormitory = await Dormitory.findById(req.params.dormitoryId);

        if (!dormitory) {
            return next(createError(404, 'Dormitory not found!'));
        }

        // Toggle dormitory status
        dormitory.active = !dormitory.active;
        dormitory.isReservationEnabled = !dormitory.isReservationEnabled;

        // Save changes
        await dormitory.save();

        // Determine the status message based on the updated dormitory status
        let statusMessage = '';
        if (dormitory.active) {
            statusMessage = 'หอพักว่าง';
        } else {
            statusMessage = 'หอพักเต็ม ไม่สามารถจองได้';
        }

        // Send response with status message
        res.status(200).json({ message: statusMessage });
    } catch (error) {
        next(error);
    }
};
