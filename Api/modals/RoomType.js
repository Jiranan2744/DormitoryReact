import mongoose from 'mongoose';

const RoomTypeSchema = new mongoose.Schema({
  dormitory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dormitory',
    required: true,
  },
  typeRooms: {
    type: String,
    required: true,
  },
  // Add any other properties related to the room type
});

export default mongoose.model('RoomType', RoomTypeSchema);
