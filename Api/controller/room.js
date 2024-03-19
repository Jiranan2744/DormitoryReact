import Room from "../modals/Room";

export const createNewRoom = async (req, res, next) => {
    try {
      // Create a new room
      const room = await Room.create(req.body);
  
      // Assuming you have a Dormitory model and you want to associate the room with a dormitory
      const { dormitoryId } = req.body;
      
      // Find the dormitory by ID
      const dormitory = await Dormitory.findById(dormitoryId);
  
      if (!dormitory) {
        return res.status(404).json({ success: false, message: 'Dormitory not found' });
      }
  
      // Add the new room to the dormitory's roomTypes array
      dormitory.roomTypes.push({
        typeRooms: room.typeRooms,
        minDaily: room.minDaily,
        maxDaily: room.maxDaily,
        minMonthly: room.minMonthly,
        maxMonthly: room.maxMonthly,
      });
  
      // Save the dormitory with the updated roomTypes
      await dormitory.save();
  
      return res.status(200).json({ success: true, message: 'Room created and associated with dormitory successfully', room });
    } catch (err) {
      next(err);
    }
  };

