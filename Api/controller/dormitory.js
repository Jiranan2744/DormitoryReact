import Dormitory from "../modals/Dormitory.js";
import Room from "../modals/Room.js"


export const createDormitory = async (req, res, next) => {
    try {
        const dormitory = await Dormitory.create(req.body);
        return res.status(200).json(dormitory);
    } catch (err) {
        next(err);
    }
}

export const updatedDormitory = async (req, res, next) => {
    try {
        const updatedDormitory = await Dormitory.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedDormitory);

    } catch (err) {
        next(err);
    }
};

export const deleteDormitory = async (req, res, next) => {
    try {
        await Dormitory.findByIdAndDelete(req.params.id)
        res.status(200).json("Dormitory has been deleted.")

    } catch (err) {
        next(err);
    }
};

export const getDormitory = async (req, res, next) => {
    try {
        const dormitory = await Dormitory.findById(req.params.id)
        res.status(200).json(dormitory)
    } catch (err) {
        next(err);
    }
};

export const getallDormitory = async (req, res, next) => {
    try {
        const dormitorys = await Dormitory.find();
        res.status(200).json(dormitorys);
    } catch (err) {
        next(err);
    }
};

export const getDormitoryRooms = async (req, res, next) => {
    try {
        const dormitory = await Dormitory.findById(req.params.id);
        const list = await Promise.all(
            dormitory.rooms.map((room) => {
                return Room.findById(room);
            })
        );
        res.status(200).json(list);
    } catch (err) {
        next(err);
    }
};