import mongoose from 'mongoose';

const RoomTypeSchema = new mongoose.Schema({

  typeRooms: {
    type: String,
    required: false,
  },
  sizeRooms: {
    type: String,
    required: false,
  },
  minDailys: {
    type: Number,
    required: false,
  },
  maxDailys: {
    type: Number,
    required: false,
  },
  minMonthlys: {
    type: Number,
    required: false,
  },
  maxMonthlys: {
    type: Number,
    required: false,
  },

  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
},
}, { timestamps: true });

export default mongoose.model('RoomType', RoomTypeSchema);
