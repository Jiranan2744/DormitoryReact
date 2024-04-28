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

    confirm: {
        type: Boolean,
        default: false 
    },

    confirmationStatus: {
        type: String,
        enum: ['Pending', 'Confirmed'],
        default: 'Pending' // Set default value to 'Pending'
    }

}, { timestamps: true });

export default mongoose.model("Reserve", reservationSchema);
