import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    dormitoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dormitory",
        required: true,
    },
    userId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    }],
    imagePayment: {
        type: Array,
        required: true
    },

}, { timestamps: true });

export default mongoose.model("Reserve", reservationSchema);
