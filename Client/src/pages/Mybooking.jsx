import { faEdit, faFileCirclePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { Tab, Nav, Button } from 'react-bootstrap';
import Navbar from '../components/navbar/Navbar';
import axios from 'axios';

export default function Mybooking() {

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);


  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Assume you have an authentication system that provides the user's ID
        const userId = 'user_id_placeholder'; // Replace with the actual user ID

        const response = await axios.get(`/reservation/reserve/customer//${userId}`);
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customer bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);




  return (
    <div>
      <Navbar />
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {bookings.length === 0 ? (
             <p style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              margin: 0
            }}>ไม่พบการจองของคุณ</p>
            ) : (
              <ul>
                {bookings.map((booking) => (
                  <li key={booking.reservation._id} style={{
                    listStyleType: 'none', /* เอาไว้ลบ bullet point ของ <li> */
                    textAlign: 'left', /* จัดให้ข้อมูลตรงกลาง */
                    border: '1px solid #ccc', /* เพิ่มกรอบสีเทารอบข้อมูล */
                    padding: '20px', /* เพิ่มระยะห่างรอบข้อมูล */
                    margin: '5%', /* เพิ่มระยะห่างระหว่างข้อมูล */

                  }}>
                    <h3>หอพัก: {booking.dormitoryInfo.name}</h3>
                    <p>Address: {booking.dormitoryInfo.address}</p>
                    <p>Check-in Date: {new Date(booking.reservation.createdAt).toLocaleDateString()}</p>
                    <p>Check-in Time: {new Date(booking.reservation.createdAt).toLocaleTimeString()}</p>
                    {/* Add more details as needed */}
                  </li>
                  
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

