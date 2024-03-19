import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({

  typeRooms: {
    type: String,
    required: true,
  },

  sizeRooms: {
    type: String,
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

}, { timestamps: true });

export default mongoose.model('Room', RoomSchema);
