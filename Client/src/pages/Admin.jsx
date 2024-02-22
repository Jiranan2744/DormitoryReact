import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import { Button, Modal, Nav, Tab, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import EditUserRoleModal from './EditUserRoleModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

import { Pie } from 'react-chartjs-2';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [dormitorys, setDormitorys] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [showListingError, setShowListingError] = useState(false);
    const [loading, setLoading] = useState(false);

    //new
    const [currentUserRole, setCurrentUserRole] = useState('');
    const { currentUser } = useSelector((state) => state.user);
    const [showModal, setShowModal] = useState(false);
    const [userId, setUserId] = useState(null);
    const [currentRole, setCurrentRole] = useState(''); // You need to manage the current role state based on your application logic
    const [newRole, setNewRole] = useState('');

    //รายการผู้ใช้งาน
    const handleShowListUser = async () => {
        try {
            setShowListingError(false);
            const res = await fetch(`/users`);
            const data = await res.json();
            if (data.success === false) {
                setShowListingError(true);
                return;
            }
            // Display user information
            setDormitorys([]);
            setUsers(data);
        } catch (error) {
            setShowListingError(true);
        }
    };

    //รายการหอพัก
    const handleShowListDormitory = async () => {
        try {
            setShowListingError(false);
            const res = await fetch(`/dormitorys`);
            const data = await res.json();
            if (data.success === false) {
                setShowListingError(true);
                return;
            }
            // Display dormitory information
            setUsers([]);
            setDormitorys(data);
        } catch (error) {
            setShowListingError(true);
        }
    };

    //รายการจอง
    const handleShowListReserve = async () => {
        try {
            setShowListingError(false);
            const res = await fetch(`/reservation/viewreservation`);
            const data = await res.json();
            if (data.success === false) {
                setShowListingError(true);
                return;
            }
            // Display reservation information
            setReservations(data); // Assuming data contains reservations, set it to the appropriate state variable.
        } catch (error) {
            setShowListingError(true);
        }
    };


    //ลบผู้ใช้งาน
    const handleDeleteUser = async (id) => {
        try {
            const response = await fetch(`/admin/deleteuser/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Failed to delete user:', response.statusText);
                const responseData = await response.json();
                console.error('Response content:', responseData);
            } else {
                const { message, users: updatedUsers } = await response.json();
                console.log(message);

                // Update the state to reflect the changes
                setUsers(updatedUsers);  // Assuming you have a state variable called 'users'
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    //ค้นหา
    const [searchTerm, setSearchTerm] = useState('');
    const [dormitorySearchTerm, setDormitorySearchTerm] = useState('');
    const [reservationSearchTerm, setReservationSearchTerm] = useState('');

    const location = useLocation();
    const [activeTab, setActiveTab] = useState("0");

    const handleTabSelect = (key) => {
        setActiveTab(key);
    };


    //ภาพรวมระบบ
    const [memberCount, setMemberCount] = useState(0);

    useEffect(() => {
        // Assume you fetch data from your server using an API
        const fetchData = async () => {
            try {
                const response = await fetch('/users'); // Replace with your actual API endpoint
                const data = await response.json();
                setUsers(data);
                setMemberCount(data.length); // Set member count based on the length of the data array
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const [dormitories, setDormitories] = useState([]);
    const [dormitoryCount, setDormitoryCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/dormitorys'); // Replace with your actual API endpoint for dormitories
                const data = await response.json();
                setDormitories(data);
                setDormitoryCount(data.length);
            } catch (error) {
                console.error('Error fetching dormitory data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <Navbar />
            <div>
                <br />
                <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
                    <Nav variant="tabs" style={{ marginLeft: '35vh', padding: '5px' }}>
                        <Nav.Item>
                            <Nav.Link href='/'>
                                หน้าหลัก
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey={4}>
                                ภาพรวมระบบ
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey={1} onClick={handleShowListUser}>
                                ข้อมูลผู้ใช้
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey={2} onClick={handleShowListDormitory}>
                                ข้อมูลหอพัก
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey={3} onClick={handleShowListReserve}>
                                ข้อมูลผู้จอง
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Tab.Container>
            </div>
            <br />



            <div style={{ textAlign: 'center' }}>
                <p>จำนวนสมาชิกทั้งหมด: {memberCount} | จำนวนหอพักทั้งหมด: {dormitoryCount}</p>
            </div>



            {activeTab === "1" && (
                <div style={{ textAlign: 'center' }}>
                    <label style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center', // Center horizontally
                        width: '100%', // Ensure the label takes the full width
                    }}>
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อผู้ใช้"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '5px',
                                margin: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '16px',
                                paddingLeft: '30px', // Add padding for the icon
                                width: '350px',
                            }}
                        />
                        <FontAwesomeIcon
                            icon={faSearch}
                            style={{
                                position: 'absolute',
                                right: '40%',
                                color: '#D4D4D4',
                            }}
                        />
                    </label>
                    <br />
                    {users.length > 0 && (
                        <Table striped bordered hover size="sm" style={{ backgroundColor: '#F2F6FA', maxWidth: '68%', margin: 'auto', textAlign: 'center' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F2F6FA', color: '#003580' }}>
                                    <th>ชื่อ</th>
                                    <th>นามสกุล</th>
                                    <th>อีเมล</th>
                                    <th>เบอร์โทร</th>
                                    <th>บทบาท</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users
                                    .filter((user) =>
                                        `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((user) => (
                                        <tr key={user._id}>
                                            <td>{user.firstname || 'ไม่พบข้อมูล'}</td>
                                            <td>{user.lastname || 'ไม่พบข้อมูล'}</td>
                                            <td>{user.email || 'ไม่พบข้อมูล'}</td>
                                            <td>{user.phone || 'ไม่พบข้อมูล'}</td>
                                            <td>{user.role || 'ไม่พบข้อมูล'}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Button>
                                                        <FontAwesomeIcon icon={faEdit} />
                                                        แก้ไขบทบาท
                                                    </Button>
                                                    <Button variant="danger" onClick={() => handleDeleteUser(user._id)} style={{ marginLeft: '10px' }}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                        ลบผู้ใช้งาน
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            )}


            {activeTab === "2" && (
                <div>
                    <label style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center', // Center horizontally
                        width: '100%', // Ensure the label takes the full width
                    }}>
                        <input
                            type="text"
                            placeholder="ค้นหาหอพัก"
                            value={dormitorySearchTerm}
                            onChange={(e) => setDormitorySearchTerm(e.target.value)}
                            style={{
                                padding: '5px',
                                margin: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '16px',
                                paddingLeft: '30px', // Add padding for the icon
                                width: '350px',
                            }}
                        />
                        <FontAwesomeIcon
                            icon={faSearch}
                            style={{
                                position: 'absolute',
                                right: '40%',
                                color: '#D4D4D4',
                            }}
                        />
                    </label>
                    <br />
                    {dormitorys.length > 0 && (
                        <Table striped bordered hover size="sm" style={{ backgroundColor: '#F2F6FA', maxWidth: '68%', margin: 'auto' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#F2F6FA', color: '#003580' }}>
                                    <th style={{ width: '25vh' }}> ชื่อหอพัก (ไทย) </th>
                                    <th style={{ width: '25vh' }}> ชื่อหอพัก (อังกฤษ) </th>
                                    <th>อีเมล</th>
                                    <th>เบอร์โทร</th>
                                    <th>ไลน์</th>
                                    <th>ที่อยู่</th>
                                    {/* Add other dormitory fields as needed */}
                                </tr>
                            </thead>
                            <tbody>
                                {dormitorys
                                    .filter((dormitory) =>
                                        dormitory.tname.toLowerCase().includes(dormitorySearchTerm.toLowerCase()) ||
                                        dormitory.ename.toLowerCase().includes(dormitorySearchTerm.toLowerCase())
                                    )
                                    .map((dormitory) => (
                                        <tr key={dormitory._id}>
                                            <td>{dormitory.tname || 'ไม่พบข้อมูล'}</td>
                                            <td>{dormitory.ename || 'ไม่พบข้อมูล'}</td>
                                            <td>{dormitory.email || 'ไม่พบข้อมูล'}</td>
                                            <td>{dormitory.phone || 'ไม่พบข้อมูล'}</td>
                                            <td>{dormitory.line || 'ไม่พบข้อมูล'}</td>
                                            <td>
                                                {dormitory.no || dormitory.street || dormitory.road || dormitory.subdistrict || dormitory.district || dormitory.province || dormitory.code
                                                    ? `${dormitory.no || ''} ${dormitory.street || ''} ${dormitory.road || ''} ${dormitory.subdistrict || ''} ${dormitory.district || ''} ${dormitory.province || ''} ${dormitory.code || ''}`
                                                    : 'ไม่พบข้อมูล'}
                                            </td>

                                            {/* Add other dormitory fields as needed */}
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            )}



            {activeTab === "3" && (
                <div>
                    <label style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center', // Center horizontally
                        width: '100%', // Ensure the label takes the full width
                    }}>
                        <input
                            type="text"
                            placeholder="ค้นหาการจอง"
                            value={reservationSearchTerm}
                            onChange={(e) => setReservationSearchTerm(e.target.value)}
                            style={{
                                padding: '5px',
                                margin: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '16px',
                                paddingLeft: '30px', // Add padding for the icon
                                width: '350px',
                            }}
                        />
                        <FontAwesomeIcon
                            icon={faSearch}
                            style={{
                                position: 'absolute',
                                right: '40%',
                                color: '#D4D4D4',
                            }}
                        />
                    </label>
                    <br />
                    {reservations.length > 0 && (
                        <Table striped bordered hover size="sm" style={{ backgroundColor: '#F2F6FA', maxWidth: '68%', margin: 'auto', textAlign: 'center' }}>
                            <thead>
                                <tr style={{ color: '#003580' }}>
                                    <th>ชื่อหอพัก</th>
                                    <th>ชื่อผู้จอง</th>
                                    <th>อีเมล</th>
                                    <th>เบอร์โทร</th>
                                    <th>วันที่ - เวลา ที่จอง</th>
                                    <th>หลักฐานการชำระเงิน</th>
                                    {/* Add other reservation fields as needed */}
                                </tr>
                            </thead>
                            <tbody>
                                {reservations
                                    .filter((reservation) =>
                                        reservation.userId[0].firstname.toLowerCase().includes(reservationSearchTerm.toLowerCase()) ||
                                        reservation.userId[0].lastname.toLowerCase().includes(reservationSearchTerm.toLowerCase())
                                    )
                                    .map((reservation) => (
                                        <tr key={reservation._id}>
                                            <td style={{ padding: '4vh' }}>{reservation.dormitoryId && `${reservation.dormitoryId.tname} ${reservation.dormitoryId.ename}`}</td>
                                            <td style={{ padding: '4vh' }}>{reservation.userId && `${reservation.userId[0].firstname} ${reservation.userId[0].lastname}`}</td>
                                            <td style={{ padding: '4vh' }}>{reservation.userId && reservation.userId[0].email ? reservation.userId[0].email : 'ไม่พบข้อมูล'}</td>
                                            <td style={{ padding: '4vh' }}>{reservation.userId && reservation.userId[0].phone ? reservation.userId[0].phone : 'ไม่พบข้อมูล'}</td>
                                            <td style={{ padding: '4vh' }}>{new Date(reservation.createdAt).toLocaleString()}</td>
                                            <td>
                                                {reservation.imagePayment && reservation.imagePayment.map((image, index) => (
                                                    <a key={index} href={image} target="_blank" rel="noopener noreferrer">
                                                        <img src={image} alt={`Payment ${index + 1}`} style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }} />
                                                    </a>
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            )}

        </div>
    );
};

export default Admin;
