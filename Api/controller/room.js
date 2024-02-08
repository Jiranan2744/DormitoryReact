import Room from "../modals/Room.js"
import Dormitory from "../modals/Dormitory.js"
import { createError } from "../utils/error.js";


// export const createRoom = async (req, res, next) => {
//     const dormitoryId = req.params.dormitoryid;
//     const newRoom = new Room(req.body);
//     try {
//         const savedRoom = await newRoom.save();
//         try {
//             await Dormitory.findByIdAndUpdate(dormitoryId, {
//                 $push: { rooms: savedRoom._id },
//             });
//         } catch (err) {
//             next(err);
//         }
//         res.status(200).json(savedRoom);
//     } catch (err) {
//         next(err);
//     }
// };


export const createNewRoom = async (req, res, next) => {
    try {
        const room = await Room.create(req.body);
        return res.status(200).json(room);
    } catch (err) {
        next(err);
    }
}

export const updatedRoom = async (req, res, next) => {
    
    const room = await Room.findById(req.params.id);

    if(!room){
        return next(createError(404, 'Room not found!'));
    }
    if(req.user.id !== room.userRoom){
        return next(createError(401, 'You can only update your own listing!'));
    }
    try {
        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedRoom);

    } catch (error) {
        next(error);
    }
}

export const deleteRoom = async (req, res, next) => {
    const dormitoryId = req.params.dormitoryid;

    try {
        await Room.findByIdAndDelete(req.params.id)
        try {
            await Dormitory.findByIdAndUpdate(dormitoryId, {
                $pull: { rooms: req.params.id },
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json("Room has been deleted.")

    } catch (err) {
        next(err);
    }
}

export const getRoom = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id)
        res.status(200).json(room)

    } catch (err) {
        next(err);
    }
}

export const getallRoom = async (req, res, next) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (err) {
        next(err);
    }
}

