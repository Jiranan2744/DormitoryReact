import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar/Navbar';
import { useParams } from 'react-router-dom';

const CustomerReserve = () => {
    const { dormitoryId } = useParams();
    const [dormitory, setDormitory] = useState({});
    const [customers, setCustomers] = useState([]);
    const [noReservations, setNoReservations] = useState(false);

    useEffect(() => {
        const fetchCustomersAndDormitory = async () => {
            try {
                // Fetch customer and dormitory information
                const response = await fetch(`/reservation/reserve/owner/${dormitoryId}`);
                const data = await response.json();

                // Set dormitory details
                setDormitory(data.dormitory);

                // Set customer details
                setCustomers(data.customers);

                // Set noReservations state based on the length of customers array
                setNoReservations(data.customers.length === 0);
            } catch (error) {
                console.error('Error fetching customers and dormitory:', error);
            }
        };

        fetchCustomersAndDormitory();
    }, [dormitoryId]);

    return (
        <div>
            <Navbar />
            <br />
            <div>
                {noReservations ? (
                    <p style={{ textAlign: 'center', color: '#FF4B54' }}>ไม่พบการจองหอพักนี้</p>
                ) : (
                    customers.map((customer) => (
                        <div key={customer._id} style={{
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '20px', // Adjust the margin-bottom to add spacing
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            backgroundColor: 'white',
                            maxWidth: '500px',
                            margin: '0 auto',
                        }}>
                            <p>ชื่อ: {customer.firstname} นามสกุล: {customer.lastname} </p>
                            <p>เบอร์โทร: 0{customer.phone}</p>
                            <p>อีเมล์: {customer.email}</p>
                            <p>Check-in Date: {customer.createAt ? new Date(customer.createAt).toLocaleDateString() : 'N/A'}</p>
                            <p>Check-in Time: {customer.createAt ? new Date(customer.createAt).toLocaleTimeString() : 'N/A'}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CustomerReserve;
