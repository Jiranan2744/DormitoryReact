import Reserve from "../modals/Reservation.js";
import Dormitory from "../modals/Dormitory.js";
import User from "../modals/User.js";

export const createReservation = async (req, res, next) => {
  try {
    const { userId, dormitoryId, imagePayment, ...reservationData } = req.body;

    // Retrieve Dormitory and User information
    const dormitory = await Dormitory.findById(dormitoryId);
    const user = await User.findById(userId);

    if (!dormitory || !user) {
      return res.status(404).json({ success: false, error: 'Dormitory or User not found.' });
    }

    // Check if the dormitory is closed
    if (!dormitory.active) {
      return res.status(400).json({ success: false, error: 'Dormitory is closed. Reservation not allowed.' });
    }

    // Check if imagePayment is attached
    if (!imagePayment || imagePayment.length === 0) {
      return res.status(400).json({ success: false, error: 'ImagePayment is required.' });
    }

    // Set Customer ID and change user role to 'customer'
    user.role = 'customer';
    await user.save();

    // Create a new reservation using the Reserve model
    const reserve = new Reserve({
      userId,
      dormitoryId,
      imagePayment,
      ...reservationData,
    });

    // Save the reservation to the database
    await reserve.save();

    // Include dormitory name and username in the response
    const response = {
      dormitoryName: dormitory.tname, // Modify this based on your dormitory schema
      username: `${user.firstname} ${user.lastname}`,
      imagePayment,
      ...reservationData,
      message: "Reservation created successfully. User is marked as a customer.",
    };

    // Respond with the created reservation details
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error in handling reservation request:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};



export const viewReservation = async (req, res, next) => {
  try {
    const viewReservation = await Reserve.find()
      .populate('dormitoryId', 'tname ename') // Specify the fields you want to populate for the dormitory
      .populate('userId', 'firstname lastname email phone'); // Specify the fields you want to populate for the user

    res.status(200).json(viewReservation);
  } catch (error) {
    next(error);
  }
};


export const getDormitoryCustomers = async (req, res, next) => {
  try {
      const { dormitoryId } = req.params;

      // Find reservations for the specified dormitory
      const reservations = await Reserve.find({ dormitoryId });

      // Extract unique user IDs from reservations
      const customerIds = Array.from(new Set(reservations.map(reservation => reservation.userId)));

      // Fetch user details and reservation date for each customer ID
      const customers = await Promise.all(customerIds.map(async (customerId) => {
          const user = await User.findById(customerId);
          const reservation = reservations.find(reservation => reservation.userId === customerId);

          return {
              _id: user._id,
              firstname: user.firstname,
              lastname: user.lastname,
              phone: user.phone,
              email: user.email,
              role: user.role,
              createAt: reservation ? reservation.createdAt : null,
          };
      }));

      // Respond with the customer details
      return res.status(200).json({ success: true, customers });
  } catch (error) {
      console.error('Error in fetching dormitory customers:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};




export const getCustomerBooking = async (req, res, next) => {
    try {
      const userId = req.user.id;
  
      // Find reservations for the customer with the specified userId
      const reservations = await Reserve.find({ userId });
  
      // If there are reservations, fetch dormitory information for each reservation
      if (reservations && reservations.length > 0) {
        const bookingsWithDormInfo = await Promise.all(
          reservations.map(async (reservation) => {
            const dormitory = await Dormitory.findById(reservation.dormitoryId);
            return {
              reservation,
              dormitoryInfo: {
                id: dormitory._id,
                name: dormitory.tname,
                address: `${dormitory.no} ${dormitory.street}, ${dormitory.district}, ${dormitory.province} ${dormitory.code}`,
              },
            };
          })
        );
  
        return res.status(200).json(bookingsWithDormInfo);
      } else {
        // No reservations found for the customer
        return res.status(404).json({ success: false, message: 'No reservations found for the customer.' });
      }
    } catch (error) {
      console.error('Error in getCustomerBooking:', error);
      next(error);
    }
  };
  

  export const deleteMember = async (req, res, next) => {
    try {
        const { dormitoryId, customerId } = req.params;

        // Check if the dormitory owner is making the request
        if (req.user.dormitoryId !== dormitoryId) {
            return res.status(403).json({ success: false, message: 'Unauthorized: Not the dormitory owner' });
        }

        // Use findOneAndUpdate to find the reservation document and pull the customerId from the userId array
        const updatedReservation = await Reserve.findOneAndUpdate(
            { dormitoryId, userId: customerId },
            { $pull: { userId: customerId } },
            { new: true }
        );

        // Update user to mark them as not reserved (Modify this based on your User model structure)
        await User.findByIdAndUpdate(customerId, { $set: { isReserved: false } });

        if (!updatedReservation) {
            return res.status(404).json({ success: false, message: 'Reservation not found' });
        }

        return res.status(200).json({ success: true, message: 'Reservation deleted successfully' });
    } catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

