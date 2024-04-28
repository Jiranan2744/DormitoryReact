import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Navbar from '../components/navbar/Navbar';
import axios from 'axios';
import useFetch from '../hooks/useFetch';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function CustomerReserve() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [reservationIdToDelete, setReservationIdToDelete] = useState(null);
    const [confirmationMessages, setConfirmationMessages] = useState({});
    const location = useLocation();
    const id = location.pathname.split("/")[2];

    const { data: dormitoryData } = useFetch(`/dormitorys/find/${id}`);

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

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`/reservation/reservations/${reservationIdToDelete}`);
            if (response.data.success) {
                console.log('Reservation deleted successfully:', reservationIdToDelete);
                setReservationIdToDelete(null);
            } else {
                console.error('Failed to delete reservation:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting reservation:', error);
        } finally {
            setShowModal(false);
        }
    };

    const handleConfirmBooking = async (reservationId) => {
        try {
            const response = await axios.put(`/reservation/confirm/${reservationId}`);
            setConfirmationMessages(prevState => ({
                ...prevState,
                [reservationId]: response.data.message
            }));

            // Update local storage with the status
            localStorage.setItem(`reservationStatus_${reservationId}`, 'Verified Successful');
        } catch (error) {
            console.error('Error confirming reservation:', error);
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
                                {reservations.map((reservation, index) => (
                                    <li key={reservation._id} style={{ marginBottom: '20px' }}>
                                        <div key={reservation._id} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <div style={{ flex: '1' }}>
                                                    <p style={{ marginBottom: '5px' }}>รหัสการจอง: {index + 1}</p>
                                                    <p style={{ marginBottom: '5px' }}>ชื่อ: {reservation.firstName}</p>
                                                    <p style={{ marginBottom: '5px' }}>นามสกุล: {reservation.lastName}</p>
                                                    <p style={{ marginBottom: '5px' }}>เบอร์โทร: 0{reservation.phoneNumber}</p>
                                                    <p style={{ marginBottom: '5px' }}>วันที่จอง: {reservation.date}</p>
                                                    <p style={{ marginBottom: '5px' }}>เวลาที่จอง: {reservation.time}</p>
                                                </div>
                                                <div style={{ flex: '1', textAlign: 'right' }}>
                                                    <img src={reservation.imagePayment} alt="User Payment" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <Button
                                                    onClick={() => handleConfirmBooking(reservation.reservationId)}
                                                    disabled={loading || confirmationMessages[reservation.reservationId] || localStorage.getItem(`reservationStatus_${reservation.reservationId}`) === 'Verified Successful'}
                                                    style={{
                                                        marginLeft: '10px',
                                                        backgroundColor: localStorage.getItem(`reservationStatus_${reservation.reservationId}`) === 'Verified Successful' ? '#54A915' : '#feba02',
                                                        border: 'none'
                                                    }}
                                                >
                                                    {localStorage.getItem(`reservationStatus_${reservation.reservationId}`) === 'Verified Successful' ? 'ยืนยันการจอง' : 'รอดำเนินการ'}
                                                </Button>

                                                {confirmationMessages[reservation.reservationId] && (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '10px', color: 'green' }}>
                                                        <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                                                        <p style={{ margin: '0' }}>{confirmationMessages[reservation.reservationId]}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
            {/* <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>ลบการจองหอพัก?</Modal.Title>
                </Modal.Header>
                <Modal.Body>คุณแน่ใจหรือไม่ว่าต้องการลบการจองหอพักนี้?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>ยกเลิก</Button>
                    <Button variant="danger" onClick={handleDelete}>ลบ</Button>
                </Modal.Footer>
            </Modal> */}
        </div>
    );
}
