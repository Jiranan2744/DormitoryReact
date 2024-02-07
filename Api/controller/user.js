import User from "../modals/User.js";
import Room from "../modals/Room.js";
import bcryptjs from 'bcryptjs';
import { createError } from '../utils/error.js';

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

export const getUserListings = async (req, res, next) => {
  try {
    // Check if the user is authorized to view the listings
    if (req.user.id !== req.params.id) {
      return next(createError(401, 'You can only view your own listings!'));
    }

    // Retrieve dormitories and rooms associated with the user
    const userDormitories = await Dormitory.find({ userRef: req.params.id });
    const userRooms = await Room.find({ userRef: req.params.id });

    // Combine dormitories and rooms into a single response
    const userListings = { dormitories: userDormitories, rooms: userRooms };

    // Send the combined listings as a JSON response
    res.status(200).json(userListings);
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};



export const getallUser = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);

    } catch (error) {
        next(error);
    }
}