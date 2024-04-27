import { faEdit, faFileCirclePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { Tab, Nav, Button, Modal } from 'react-bootstrap';
import Navbar from '../components/navbar/Navbar';
import axios from 'axios';

export default function Mybooking() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [reservationIdToDelete, setReservationIdToDelete] = useState(null);

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

  const handleDelete = async (reservationId) => {
    // Find the reservation from the bookings array
    const booking = bookings.find(booking => booking.reservationId === reservationId);

    // Check if the reservation exists and if it has been confirmed
    if (booking && !booking.confirmationStatus) {
      // Set the reservation ID to delete and show the modal
      setReservationIdToDelete(reservationId);
      setShowModal(true);
    }
  };


  const confirmDelete = async () => {
    try {
      const response = await axios.delete(`/reservation/reservations/${reservationIdToDelete}`);
      if (response.data.success) {

      } else {
        // Handle error response
        console.error('Failed to delete reservation:', response.data.message);
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error deleting reservation:', error);
    } finally {
      // Close the modal
      setShowModal(false);
    }
  };


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
                  <li key={booking.reservationId}
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

                    {booking && booking.dormitoryInfo ? (
                      <>
                        <h3>{booking.dormitoryInfo.name}</h3>
                        <p>ที่อยู่หอพัก: {booking.dormitoryInfo.address}</p>
                        <p>สถานะการจอง: {booking.confirmationMessage}</p>
                        <p>วันที่จอง: {booking.date}</p>
                        <p>เวลาที่จอง: {booking.time}</p>
                      </>
                    ) : (
                      <p>ไม่พบข้อมูลหอพัก</p>
                    )}
                    
                    {/* {booking.dormitoryInfo.roomTypes.map((roomType, roomIndex) => (
                      <div key={roomIndex}>
                        <p>ประเภทห้องพัก: {roomType.typeRooms}</p>
                        <p>ขนาดห้องพัก: {roomType.sizeRooms}</p>
                      </div>
                    ))} */}


                    <div style={{ textAlign: 'right' }}>

                      <Button
                        style={{
                          backgroundColor: booking.confirmationStatus ? '' : '#DF130C',
                          color: 'white',
                          padding: '10px',
                          border: 'none',
                          cursor: 'pointer',
                          marginTop: '10px',
                        }}
                        onClick={() => handleDelete(booking.reservationId)}
                        disabled={booking.confirmationStatus}
                      >
                        {booking.confirmationStatus ? 'จองสำเร็จ' : 'ยกเลิกการจอง'}
                      </Button>





                    </div>


                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      {/* Modal for confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>ยกเลิกการจองหอพัก?</Modal.Title>

        </Modal.Header>
        <Modal.Body>
          <span>คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้? เมื่อยกเลิกเเล้ว โปรดติดต่อเจ้าของหอพัก เพื่อรับเงินค่ามัดจำคืน</span>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            ยกเลิก
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            ยืนยัน
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

