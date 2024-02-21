import Dormitory from "../modals/Dormitory.js";
import User from "../modals/User.js";
import Facility from "../modals/Facility.js";
import { createError } from "../utils/error.js";


export const createDormitory = async (req, res, next) => {
    try {
        const { userRef, ...dormitoryData } = req.body;

        if (!userRef) {
            return res.status(400).json({ error: "userRef is required for dormitory ownership." });
        }
        // Assuming you have a Dormitory model
        const dormitory = await Dormitory.create({
            userRef,
            ...dormitoryData,
        });
        // Set the role to "owner" for the associated user
        const user = await User.findById(userRef);
        if (user) {
            user.role = "owner";
            await user.save();
        }

        return res.status(200).json(dormitory);
    } catch (err) {
        next(err);
    }
};


export const updateDormitory = async (req, res, next) => {

    const dormitory = await Dormitory.findById(req.params.id);

    if (!dormitory) {
        return next(createError(404, 'Dormitory not found!'));
    }

    try {
        const updatedDormitory = await Dormitory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedDormitory);

    } catch (error) {
        next(error);
    }
};

export const deleteDormitory = async (req, res, next) => {

    const dormitory = await Dormitory.findById(req.params.id);

    if (!dormitory) {
        return next(createError(404, 'Dormitory not found!'));
    }

    if (req.user.id !== dormitory.userRef.toString()) {
        return next(createError(401, 'You can only delete your own listing!'));
    }
    try {
        await Dormitory.findByIdAndDelete(req.params.id)
        res.status(200).json("Dormitory has been deleted.")

    } catch (error) {
        next(error);
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

//เก็บสิ่งอำนวยความสะดวก
export const saveOptions = async (req, res, next) => {
    try {
        const dormitory = await Dormitory.findById(req.params.id);

        if (!dormitory) {
            console.error('Dormitory not found!');
            return next(createError(404, 'Dormitory not found!'));
        }

        // Retrieve facility IDs based on the selected options
        const facilityIds = await Facility.find({ facilities_name: { $in: req.body.options } }).distinct('_id');

        // Update dormitory facilities with the retrieved facility IDs
        dormitory.facilities = facilityIds;

        const updatedDormitory = await dormitory.save();

        console.log('Dormitory options updated successfully:', updatedDormitory);
        res.status(200).json(updatedDormitory);
    } catch (error) {
        console.error('Error updating dormitory options:', error);
        next(error);
    }
};

export const getOptions = async (req, res, next) => {
    try {
        const facilities = await Facility.find();
        res.status(200).json(facilities);
    } catch (error) {
        console.error('Error fetching facilities:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getOptionSelect = async (req, res, next) => {
    try {
        const dormitoryId = req.params.dormitoryId; // Assuming you pass dormitoryId as a parameter

        // Assuming dormitoryId is a valid ObjectId
        const dormitory = await Dormitory.findById(dormitoryId).populate('facilities');

        if (!dormitory) {
            console.error('Dormitory not found!');
            return res.status(404).json({ error: 'Dormitory not found!' });
        }

        const facilities = dormitory.facilities.map((facility) => ({
            _id: facility._id,
            facilities_name: facility.facilities_name,
        }));

        res.status(200).json(facilities);
    } catch (error) {
        console.error('Error fetching facilities:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const saveStatus = async (req, res, next) => {
    const { dormitoryId } = req.params;
    const { isReservationEnabled } = req.body;

    try {

        const updatedDormitory = await Dormitory.findByIdAndUpdate(
            dormitoryId,
            { isReservationEnabled },
            { new: true }
        );

        if (!updatedDormitory) {
            return res.status(404).json({ error: 'Dormitory not found' });
        }

        res.status(200).json(updatedDormitory);
    } catch (error) {
        console.error('Error updating dormitory status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateStatus = async (req, res, next) => {
    const { id } = req.params;
    const { isReservationEnabled } = req.body;

    try {
        const dormitory = await Dormitory.findByIdAndUpdate(
            id,
            { isReservationEnabled },
            { new: true }
        );

        // Respond with the updated room data
        res.status(200).json(dormitory);
    } catch (error) {
        console.error('Error updating dormitory status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
