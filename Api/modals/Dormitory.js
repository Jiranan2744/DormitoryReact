import mongoose from "mongoose";

const DormitorySchema = new mongoose.Schema({

    tname: {
        type: String,
        required: false,
    },
    ename: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    line: {
        type: String,
        required: false,
    },
    no: {
        type: String,
        required: false,
    },
    street: {
        type: String,
        required: false,
    },
    road: {
        type: String,
        required: false,
    },
    district: {
        type: String,
        required: false,
    },
    subdistrict: {
        type: String,
        required: false,
    },
    province: {
        type: String,
        required: false,
    },
    code: {
        type: String,
        required: false,
    },
    image: {
        type: Array,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    typeRoom: {
        type: String,
        required: false,
    },
    sizeRoom: {
        type: Number,
        required: false,
    },
    minDaily: {
        type: Number,
        required: false,
    },
    maxDaily: {
        type: Number,
        required: false,
    },
    minMonthly: {
        type: Number,
        required: false,
    },
    maxMonthly: {
        type: Number,
        required: false,
    },
    billWater: {
        type: Number,
        required: false,
    },
    billElectrict: {
        type: Number,
        required: false,
    },
    insurance: {
        type: Number,
        required: false,
    },
    advance: {
        type: Number,
        required: false,
    },
    billInternet: {
        type: Number,
        required: false,
    },
    billTelephone: {
        type: Number,
        required: false,
    },
    service: {
        type: Number,
        required: false,
    },
    facilities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Facility",
    }],

    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    isReservationEnabled: {
        type: Boolean,
        default: true, // Set the default value to true or false based on your requirement
    },

    active: { 
        type: Boolean, 
        default: true 
    }, 
      reservations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reserve",
    }],
    
    roomType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RoomType",
        required: false,
    },
}, { timestamps: true });


export default mongoose.model("Dormitory", DormitorySchema)