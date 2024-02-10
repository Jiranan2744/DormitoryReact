import Reserve from "../modals/Reserve.js";
import Dormitory from "../modals/Dormitory.js";
import User from "../modals/User.js";

export const createReservation = async (req, res, next) => {
    try {
        const { userRef, imagePayment, ...otherReservationData } = req.body;

        if (!userRef || !userRef.userIds || !userRef.userIds.length) {
            return res.status(400).json({ error: "userRef with userIds is required for dormitory ownership." });
        }

        // Assuming you have a Dormitory model
        const dormitory = await Dormitory.create({
            userRef,
            ...otherReservationData,
        });

        // Set the role to "owner" for the associated users
        const users = await User.find({ _id: { $in: userRef.userIds } });
        if (users) {
            users.forEach(async (user) => {
                user.role = "owner";
                await user.save();
            });
        }

        // Save dormitory, users, and imagePayment to the Reserve collection
        const reserve = new Reserve({
            dormitoryId: dormitory._id,
            userId: userRef.userIds,
            imagePayment,
            ...otherReservationData,
        });
        await reserve.save();

        // Respond with the created reservation details
        return res.status(200).json({
            dormitoryId: dormitory._id,
            userId: userRef.userIds,
            imagePayment,
            ...otherReservationData,
            message: "Reservation created successfully.",
        });
    } catch (err) {
        next(err);
    }
};