import mongoose from "mongoose";

const DormitorySchema = new mongoose.Schema({

    tname: {
        type: String,
        required:true
    },
    ename: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    phone: {
        type: String,
        required:true
    },
    line: {
        type: String,
        required:true
    },
    no: {
        type: String,
        required:true
    },
    street: {
        type: String,
        required:true
    },
    road: {
        type: String,
        required:true
    },
    district: {
        type: String,
        required:true
    },
    subdistrict: {
        type: String,
        required:true
    },
    province: {
        type: String,
        required:true
    },
    code: {
        type: String,
        required:true
    },
    image: {
        type: Array,
        required: true,
    },

    imagePayment: {
        type: Array,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    typeRooms: {
        type: String,
        required: true,
    },
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

    userRef: {
        type: String,
        required: true,
      },
   
});

export default mongoose.model("Dormitory", DormitorySchema)