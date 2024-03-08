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

        const response = await axios.get(`/reservation/reserve/customer/${userId}`);
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
                  <li key={booking.reservation._id} 
                  style={{
                    listStyleType: 'none',
                    borderRadius: '10px',
                    textAlign: 'left',
                    border: '1px solid #ccc',
                    width: '65%',
                    padding: '20px',
                    marginTop: '40px',
                    marginLeft: '35vh',
                  }}>

                    <h3>{booking.dormitoryInfo.name}</h3>
                    <p>ที่อยู่หอพัก: {booking.dormitoryInfo.address}</p>
                    <p>วันที่จอง: {new Date(booking.reservation.createdAt).toLocaleDateString()}</p>
                    <p>เวลาที่จอง: {new Date(booking.reservation.createdAt).toLocaleTimeString()}</p>
                    {/* Add more details as needed */}

                    {/* Delete button */}
                    <Button
                      style={{
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '10px',
                      }}
                      onClick={() => (booking.reservation._id)}
                    >
                      ยกเลิกการจอง
                    </Button>
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

