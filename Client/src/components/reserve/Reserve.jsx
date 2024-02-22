import { faEdit, faFileCirclePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../navbar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { Tab, Nav, Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

import axios from 'axios';

function Reserve() {

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const handleShowList = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/users/listing/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleListDelete = async (listingId) => {
    try {
      const res = await fetch(`/dormitorys/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prev) => prev.filter((list) => list._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  //open-close หอพัก
  const [dormitoryId, setDormitoryId] = useState(null);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const navigate = useNavigate(); // Use the useNavigate hook instead of useHistory

  useEffect(() => {
    // Fetch dormitory listings when the component mounts
    const fetchListings = async () => {
      try {
        const response = await axios.get('/dormitorys');
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching dormitory listings:', error);
      }
    };

    fetchListings();
  }, []);

  const handleToggleReservations = async (dormitoryId) => {
    try {
      // Toggle the reservations status for the specific dormitory
      await axios.put(`/users/dormitorys/${dormitoryId}/toggle-status`);
      // Additional actions for toggling reservations for the specific dormitoryId
      setListings((prevListings) =>
        prevListings.map((dormitory) =>
          dormitory._id === dormitoryId
            ? { ...dormitory, active: !dormitory.active }
            : dormitory
        )
      );
    } catch (error) {
      console.error('Error toggling dormitory status:', error);
    }
  };


  return (
    <div>
      <Navbar />
      <div style={{ flexDirection: 'column', gap: '2px', paddingLeft: '35vh', marginTop: '5vh' }}>
        <span style={{ fontSize: '1.5rem', fontWeight: '600' }}>ลงประกาศหอพัก</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Tab.Container defaultActiveKey="tab1">
          <Nav variant="tabs" style={{ marginLeft: '35vh', padding: '5px' }}>
            <Nav.Item>
              <Nav.Link href='/'>
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="tab2" onClick={handleShowList}>
                My Dormitory
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Tab.Container>
        <br />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <br />
          <Table striped bordered style={{ width: '100%' }}>

            {/* <thead style={{ textAlign: 'center' }} >
              <tr>
                <th>ไอดี</th>
                <th>ชื่อหอพัก (ไทย)</th>
                <th>ชื่อหอพัก (อังกฤษ)</th>
                <th>อีเมล์</th>
                <th>เบอร์โทร</th>
                <th>ไลน์</th>
              </tr>
            </thead> */}

            <tbody>
              {userListings && userListings.length > 0 && userListings.map((listing) => (
                <tr key={listing._id}>
                  <td>
                    <Link
                      style={{
                        color: '#0d6efd',
                        fontWeight: 'san-serif',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        display: 'block',
                        margin: '3vh',
                        textAlign: 'center',
                      }}
                      to={`/reservation/reserve/owner/${listing._id}`}
                    >
                      รายการจองของลูกค้า
                    </Link>
                  </td>

                  <td>
                    <Link
                      style={{
                        color: '#374151',
                        fontWeight: '300',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        display: 'block',
                        margin: '3vh',
                        textAlign: 'center',
                      }}
                      to={`/listing/${listing._id}`}
                    >
                      {listing.tname}
                    </Link>
                  </td>
                  <td>
                    <Link
                      style={{
                        color: '#374151',
                        fontWeight: '300',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        display: 'block',
                        margin: '3vh',
                        textAlign: 'center',
                      }}
                      to={`/listing/${listing._id}`}
                    >
                      {listing.ename}
                    </Link>
                  </td>
                  <td>
                    <Link
                      style={{
                        color: '#374151',
                        fontWeight: '300',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        display: 'block',
                        margin: '3vh',
                        textAlign: 'center',
                      }}
                      to={`/listing/${listing._id}`}
                    >
                      {listing.email}
                    </Link>
                  </td>
                  <td>
                    <Link
                      style={{
                        color: '#374151',
                        fontWeight: '300',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        display: 'block',
                        margin: '3vh',
                        textAlign: 'center',
                      }}
                      to={`/listing/${listing._id}`}
                    >
                      {listing.phone}
                    </Link>
                  </td>
                  <td>
                    <Link
                      style={{
                        color: '#374151',
                        fontWeight: '300',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        display: 'block',
                        margin: '3vh',
                        textAlign: 'center',
                      }}
                      to={`/listing/${listing._id}`}
                    >
                      {listing.line}
                    </Link>
                  </td>

                  <td>
                    <div style={{ textAlign: 'center' }}>
                      {listings.map((dormitory) => (
                        <div key={dormitory._id}>
                          <p>หอพัก: {dormitory.active ? 'เปิด' : 'ปิด'}</p>
                          <Form.Check
                            type="switch"
                            id={`custom-switch-${dormitory._id}`}
                            label=""
                            style={{ display: 'flex', justifyContent: 'center' }}
                            checked={dormitory.active}
                            onChange={() => handleToggleReservations(dormitory._id)}
                          />
                          
                        </div>
                      ))}
                    </div>
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <Link
                      to={`/update/${listing._id}`}
                      style={{
                        color: 'green',
                        borderRadius: '5px',
                        borderRightColor: 'green',
                        display: 'inline-block',
                        padding: '8px 16px',  // Adjust padding as needed
                        textDecoration: 'none',
                        backgroundColor: 'lightgreen',  // Optional background color
                        margin: '2vh',
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} style={{ marginRight: '8px' }} /> Edit
                    </Link>
                    <Button onClick={() => handleListDelete(listing._id)} style={{ color: 'red', borderRadius: '5px', margin: '1vh', backgroundColor: '#ff7f7f', border: 'none', padding: '8px 16px' }}>
                      <FontAwesomeIcon icon={faTrash} style={{ marginRight: '8px' }} /> Delete
                    </Button>


                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* เเจ้ง error */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p style={{ color: 'red' }}>{showListingError ? 'คุณไม่มีรายการประกาศในขณะนี้' : ''}</p>
      </div>

    </div>

  );
}

export default Reserve;
