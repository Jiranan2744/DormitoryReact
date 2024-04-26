import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Navbar from '../components/navbar/Navbar';
import axios from 'axios';
import useFetch from '../hooks/useFetch';
import { useLocation } from 'react-router-dom';

export default function CustomerReserve() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [reservationIdToDelete, setReservationIdToDelete] = useState(null);
    const location = useLocation();
    const id = location.pathname.split("/")[2]; // Get id from URL path

    const { data: dormitoryData } = useFetch(`/dormitorys/find/${id}`); // Fetch dormitory data using id

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get(`/dormitorys/find/reserve/${id}`);
                setReservations(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dormitory reservations:', error);
                setLoading(false);
            }
        };

        if (id) {
            fetchReservations();
        }
    }, [id]);

    const handleDelete = async (reservationId) => {
        setReservationIdToDelete(reservationId);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            if (!reservationIdToDelete) {
                console.error('Reservation ID to delete is not defined.');
                return;
            }

            const response = await axios.delete(`/dormitorys/find/reserve/${reservationIdToDelete}`);
            if (response.data.success) {
                console.log('Reservation deleted successfully:', reservationIdToDelete);
                // Optionally update state or refetch reservations
            } else {
                console.error('Failed to delete reservation:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting reservation:', error);
        } finally {
            setShowModal(false); // Hide the modal regardless of success or failure
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        {reservations.length === 0 ? (
                            <div style={{ textAlign: 'center', marginTop: '40vh' }}>
                                <p>ไม่พบการจอง</p>
                            </div>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                
                                {reservations.map((reservation) => (
                                    <li key={reservation._id} style={{ marginBottom: '20px' }}>
                                       
                                        <div key={reservation._id} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div style={{ textAlign: 'left', marginRight: '20px' }}>
                                                    <p>ชื่อ: {reservation.firstName}</p>
                                                    <p>นามสกุล: {reservation.lastName}</p>
                                                    <p>เบอร์โทร: 0{reservation.phoneNumber}</p>
                                                    <p>วันที่จอง: {reservation.date}</p>
                                                    <p>เวลาที่จอง: {reservation.time}</p>
                                                </div>
                                                <div>
                                                    <img
                                                        src={reservation.imagePayment}
                                                        alt="User Payment"
                                                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                                                    />
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'right', marginLeft: '20px' }}>
                                                <Button
                                                    style={{
                                                        color: 'white',
                                                        padding: '10px',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        marginTop: '10px',
                                                    }}
                                                    variant="danger" onClick={() => handleDelete(reservation.reservationId)}
                                                >
                                                    ลบการจอง
                                                </Button>
                                            </div>

                                            
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
            {/* ลบการจองของลูกค้า */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>ลบการจองหอพัก?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span> ลบการจองของผู้ใช้ ใช่หรือไม่?</span>
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
}