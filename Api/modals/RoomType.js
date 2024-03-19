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

}, { timestamps: true });


export default mongoose.model('RoomType', RoomTypeSchema);
