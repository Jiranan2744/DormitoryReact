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
            <div style={{ padding: '20px' }}>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        {reservations.length === 0 ? (
                            <div style={{ textAlign: 'center', marginTop: '20%' }}>
                                <p>ไม่พบการจอง</p>
                            </div>                        ) : (
                            <ul>
                                {reservations.map((reservation) => (
                                    <li key={reservation._id} style={{ marginBottom: '20px' }}>
                                        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                                            <p>ชื่อ: {reservation.firstName} นามสกุล: {reservation.lastName}</p>
                                            <p>เบอร์โทร: 0{reservation.phoneNumber}</p>
                                            <p>วันที่จอง: {reservation.date}</p>
                                            <p>เวลาที่จอง: {reservation.time}</p>
                                            <img src={reservation.imagePayment} alt="User Payment" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                                            <div>
                                                <Button
                                                    style={{
                                                        backgroundColor: 'red',
                                                        color: 'white',
                                                        padding: '10px',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        marginTop: '10px',
                                                    }}
                                                    onClick={() => handleDelete(reservation.reservationId)} // Pass reservation ID to handleDelete
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
}