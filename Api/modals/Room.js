import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({

    dormitoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dormitory", // Reference to the Dormitory model
        required: true,
    },
    userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    }],

    // roomNumbers: [{ number: Number, unavailableDates: { type: [Date] } }],
}, { timestamps: true });


export default mongoose.model("Room", RoomSchema)