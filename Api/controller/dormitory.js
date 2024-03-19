import Dormitory from "../modals/Dormitory.js";
import User from "../modals/User.js";
import RoomType from "../modals/RoomType.js";
import Facility from "../modals/Facility.js";
import { createError } from "../utils/error.js";

export const createDormitory = async (req, res, next) => {
  try {
    const { userRef, roomTypes, ...dormitoryData } = req.body;

    if (!userRef) {
      return res.status(400).json({ error: "userRef is required for dormitory ownership." });
    }

    const dormitory = await Dormitory.create({
      userRef,
      roomTypes: [], // Initialize with an empty array for now
      ...dormitoryData,
    });

    const user = await User.findById(userRef);
    if (user) {
      user.role = "owner";
      await user.save();
    }

    if (roomTypes && roomTypes.length > 0) {
      const createdRoomTypes = await Room.create(roomTypes);

      // Log the created room types
      console.log("Created Room Types:", createdRoomTypes);

      dormitory.roomTypes = createdRoomTypes.map(room => room._id);
    }

    // Save the updated dormitory with roomTypes
    await dormitory.save();

    return res.status(200).json(dormitory);
  } catch (err) {
    console.error('Error creating dormitory:', err);
    next(err);
  }
};



export const createNewRoom = async (req, res, next) => {
  try {

    // Create a new room type
    const { dormitoryId, ...roomData } = req.body;
    const roomType = await RoomType.create({ dormitory: dormitoryId, ...roomData });

    // Example: Assuming you have a criterion to determine the dormitory (replace this with your logic)
    const { someCriterion } = req.body;

    // Find the dormitory based on the criterion
    const dormitory = await Dormitory.findOne({ someField: someCriterion });

    if (!dormitory) {
      return res.status(404).json({ success: false, message: 'Dormitory not found' });
    }

    // Add the new room type to the dormitory's roomTypes array
    dormitory.roomTypes.push(roomType);

    // Save the dormitory with the updated roomTypes
    await dormitory.save();

    // Return success response
    return res.status(200).json({ success: true, message: 'Room created and associated with dormitory successfully', roomType });
  } catch (err) {
    next(err);
  }
};


export const getRoomType = async (req, res, next) => {
  try {
    // Assuming dormitoryId is obtained from the authenticated user
    const { dormitoryId } = req.user;

    // Fetch room types based on the authenticated user's dormitory ID
    const roomTypes = await RoomType.find({ dormitory: dormitoryId });

    if (roomTypes.length > 0) {
      // If there are room types, send the formatted room types as a JSON response
      const formattedRoomTypes = roomTypes.map(({ _id, typeRooms, sizeRooms, minDaily, maxDaily, minMonthly, maxMonthly }) => ({
        roomId: _id,
        typeRooms,
        sizeRooms,
        minDaily,
        maxDaily,
        minMonthly,
        maxMonthly,
      }));
      res.status(200).json({ success: true, roomTypes: formattedRoomTypes });
    }
  } catch (error) {
    // Handle errors
    console.error('Error fetching room types:', error);
    res.status(500).json({ success: false, message: 'Error fetching room types' });
  }
};


export const updateDormitory = async (req, res, next) => {

  const dormitory = await Dormitory.findById(req.params.id);

  if (!dormitory) {
    return next(createError(404, 'Dormitory not found!'));
  }

  try {
    const updatedDormitory = await Dormitory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedDormitory);

  } catch (error) {
    next(error);
  }
};

export const deleteDormitory = async (req, res, next) => {

  const dormitory = await Dormitory.findById(req.params.id);

  if (!dormitory) {
    return next(createError(404, 'Dormitory not found!'));
  }

  if (req.user.id !== dormitory.userRef.toString()) {
    return next(createError(401, 'You can only delete your own listing!'));
  }
  try {
    await Dormitory.findByIdAndDelete(req.params.id)
    res.status(200).json("Dormitory has been deleted.")

  } catch (error) {
    next(error);
  }
};


export const getDormitory = async (req, res, next) => {
  try {
    const dormitory = await Dormitory.findById(req.params.id)
    res.status(200).json(dormitory)
  } catch (err) {
    next(err);
  }
};

export const getallDormitory = async (req, res, next) => {
  try {
    const dormitorys = await Dormitory.find();
    res.status(200).json(dormitorys);
  } catch (err) {
    next(err);
  }
};

//เก็บสิ่งอำนวยความสะดวก
export const saveOptions = async (req, res, next) => {
  try {
    const dormitory = await Dormitory.findById(req.params.id);

    if (!dormitory) {
      console.error('Dormitory not found!');
      return next(createError(404, 'Dormitory not found!'));
    }

    // Retrieve facility IDs based on the selected options
    const facilityIds = await Facility.find({ facilities_name: { $in: req.body.options } }).distinct('_id');

    // Update dormitory facilities with the retrieved facility IDs
    dormitory.facilities = facilityIds;

    const updatedDormitory = await dormitory.save();

    console.log('Dormitory options updated successfully:', updatedDormitory);
    res.status(200).json(updatedDormitory);
  } catch (error) {
    console.error('Error updating dormitory options:', error);
    next(error);
  }
};

export const getOptions = async (req, res, next) => {
  try {
    const facilities = await Facility.find();
    res.status(200).json(facilities);
  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getOptionSelect = async (req, res, next) => {
  try {
    const dormitoryId = req.params.dormitoryId; // Assuming you pass dormitoryId as a parameter

    // Assuming dormitoryId is a valid ObjectId
    const dormitory = await Dormitory.findById(dormitoryId).populate('facilities');

    if (!dormitory) {
      console.error('Dormitory not found!');
      return res.status(404).json({ error: 'Dormitory not found!' });
    }

    const facilities = dormitory.facilities.map((facility) => ({
      _id: facility._id,
      facilities_name: facility.facilities_name,
    }));

    res.status(200).json(facilities);
  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const saveStatus = async (req, res, next) => {
  const { dormitoryId } = req.params;
  const { isReservationEnabled } = req.body;

  try {
    const updatedDormitory = await Dormitory.findByIdAndUpdate(
      dormitoryId,
      { $set: { isReservationEnabled } }, // Use $set to update the specific field
      { new: true }
    );

    if (!updatedDormitory) {
      return res.status(404).json({ error: 'Dormitory not found' });
    }

    res.status(200).json(updatedDormitory);
  } catch (error) {
    console.error('Error updating dormitory status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



export const updateStatus = async (req, res, next) => {
  try {
    const { userId, dormitoryId, status } = req.body;

    const dormitory = await Dormitory.findById(dormitoryId);

    if (!dormitory) {
      return res.status(404).json({ message: 'Dormitory not found' });
    }

    // Check if the user is the owner of the dormitory
    if (dormitory.ownerId !== userId) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Check if the requested status is valid ('open' or 'close')
    if (!['open', 'close'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Update the dormitory status only if the status is changing
    if (dormitory.status !== status) {
      // If closing the dormitory, prevent reservations
      if (status === 'close') {
        // Set the flag to indicate reservations are not allowed
        dormitory.isReservationEnabled = false;
      } else {
        // If opening the dormitory, allow reservations
        dormitory.isReservationEnabled = true;
      }

      dormitory.status = status;
      await dormitory.save();
    }

    // If the dormitory is closed, inform customers that reservations are not allowed
    if (status === 'close') {
      return res.status(200).json({ message: 'Dormitory closed. Reservations are not allowed. The dormitory is full.' });
    }

    res.status(200).json({ message: 'Dormitory status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
