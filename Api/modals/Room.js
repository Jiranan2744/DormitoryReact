import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({

    // typeRooms: {
    //     type: String,
    //     required: true,
    // },
    sizeRooms: {
        type: Number,
        required: true,
    },
    minDaily: {
        type: Number,
        required: true,
    },
    maxDaily: {
        type: Number,
        required: true,
    },
    minMonthly: {
        type: Number,
        required: true,
    },
    maxMonthly: {
        type: Number,
        required: true,
    },
    billWater: {
        type: Number,
        required: true,
    },
    billElectrict: {
        type: Number,
        required: true,
    },
    insurance: {
        type: Number,
        required: true,
    },
    advance: {
        type: Number,
        required: true,
    },
    billInternet: {
        type: Number,
        required: true,
    },
    billTelephone: {
        type: Number,
        required: true,
    },
    service: {
        type: Number,
        required: true,
    },

    // userRef: {
    //     type: String,
    //     required: true,
    //   },


    // roomNumbers: [{ number: Number, unavailableDates: { type: [Date] } }],
},
    { timestamps: true }
);


export default mongoose.model("Room", RoomSchema)