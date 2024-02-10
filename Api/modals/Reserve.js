import mongoose from "mongoose";

const ReserveSchema = new mongoose.Schema({
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
    imagePayment: {
        type: String, // Assuming you store the URL or path to the image in Firebase
        required: true,
    },
});

export default mongoose.model("Reserve", ReserveSchema);
