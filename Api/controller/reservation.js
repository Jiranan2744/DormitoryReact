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

    // Update the dormitory with the reservation ID
    dormitory.reservations.push(reserve._id);
    await dormitory.save();

    // Include dormitory name and username in the response
    const response = {
      dormitoryName: dormitory.tname,
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

export const viewReservationById = async (req, res, next) => {
  try {
    const { reservationId } = req.params;

    // Find the reservation by ID
    const reservation = await Reserve.findById(reservationId)
      .populate('dormitoryId', 'tname ename') // Specify the fields you want to populate for the dormitory
      .populate('userId', 'firstname lastname email phone'); // Specify the fields you want to populate for the user

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    res.status(200).json(reservation);
  } catch (error) {
    next(error);
  }
};


export const deleteReservationById = async (req, res, next) => {
  try {
    const { reservationId } = req.params;

    // Find the reservation by ID and delete it
    const deletedReservation = await Reserve.findByIdAndDelete(reservationId);

    if (!deletedReservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    res.status(200).json({ success: true, message: 'Reservation deleted successfully' });
  } catch (error) {
    next(error);
  }
};



export const getCustomerBooking = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in the request object

    // Find reservations for the customer with the specified userId
    const reservations = await Reserve.find({ userId });

    // If there are reservations, fetch dormitory information for each reservation
    if (reservations && reservations.length > 0) {
      const bookingsWithDormInfo = await Promise.all(
        reservations.map(async (reservation) => {
          const dormitory = await Dormitory.findById(reservation.dormitoryId);
          const customer = await User.findById(reservation.userId);

          // Ensure dormitory and customer objects exist and have the required properties
          if (dormitory && customer) {
            return {
              dormitoryId: dormitory._id, // Add dormitory ID to the response
              reservationId: reservation._id, // Add reservation ID to the response
              date: new Date(reservation.createdAt).toLocaleDateString(), // Add date of reservation to the response
              time: new Date(reservation.createdAt).toLocaleTimeString(), // Add time of reservation to the response
              dormitoryInfo: {
                id: dormitory._id,
                name: `${dormitory.tname} ${dormitory.ename}`,
                address: `${dormitory.no} ${dormitory.street} ${dormitory.district} ${dormitory.province} ${dormitory.code}`,
                roomTypes: dormitory.roomTypes, // Add roomTypes information
              },
              customerInfo: {
                firstname: customer.firstname,
                lastname: customer.lastname,
                email: customer.email,
                phone: customer.phone,
                imagePayment: customer.imagePayment, // Assuming imagePayment is an array in your User model
              },
            };
          } else {
            // If dormitory or customer is null, skip this reservation
            return null;
          }
        })
      );

      // Filter out null bookings
      const validBookings = bookingsWithDormInfo.filter(booking => booking !== null);

      return res.status(200).json(validBookings);
    } else {
      // No reservations found for the customer
      return res.status(404).json({ success: false, message: 'No reservations found for the customer.' });
    }
  } catch (error) {
    console.error('Error in getCustomerBooking:', error);
    next(error);
  }
};



export const getDormitoryCustomers = async (req, res, next) => {
  try {
    const { dormitoryId } = req.params;

    // Fetch reservations for the specified dormitory
    const reservations = await Reserve.find({ dormitoryId });

    // Extract unique user IDs from reservations
    const customerIds = Array.from(new Set(reservations.map(reservation => reservation.userId)));

    // Fetch user details including firstname and lastname for each customer
    const customers = await Promise.all(customerIds.map(async (userId) => {
      const user = await User.findById(userId).select('firstname lastname');

      // Filter reservations for the current user
      const userReservations = reservations.filter(reservation => reservation.userId === userId);

      // Extract reservation details and dormitory name from each reservation
      const reservationDetails = await Promise.all(userReservations.map(async (reservation) => {
        const dormitory = await Dormitory.findById(reservation.dormitoryId).select('name');
        return {
          dormitoryName: dormitory.tname,
          reservationId: reservation._id,
          bookingDate: reservation.createdAt,
          bookingTime: reservation.updatedAt
        };
      }));

      return {
        userId,
        firstname: user.firstname,
        lastname: user.lastname,
        reservations: reservationDetails
      };
    }));

    // Respond with the list of users, their firstname, lastname, and reservation details including dormitory name
    return res.status(200).json({ success: true, customers });
  } catch (error) {
    console.error('Error in fetching dormitory customers:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
