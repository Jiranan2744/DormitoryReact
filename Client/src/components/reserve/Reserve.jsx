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
import CustomerReserve from '../../pages/CustomerReserve';


const Reserve = ({ dormitoryId }) => {


  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);


  //จขห. ดูหอพักที่ลงประกาศ
  const handleShowList = async () => {
    try {
      setShowListingError(false);

      const res = await fetch(`/users/listing`);

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
  const [statusMessage, setStatusMessage] = useState('หอพักว่าง'); // Initialize with 'หอพักว่าง' to indicate an empty dormitory

  const handleToggle = async (dormitoryId) => {
    try {
      const response = await axios.put(`/users/status/${dormitoryId}`);
      const updatedStatus = response.data.message; // Assuming the response contains the updated status
      setStatusMessage(updatedStatus);
    } catch (error) {
      console.error('Error toggling dormitory status:', error);
      setStatusMessage('Error toggling dormitory status');
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
                กลับหน้าหลัก
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="tab1" onClick={handleShowList}>
                หอพักของฉัน
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Tab.Container>
        <br />

        {/* แจ้ง error */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {showListingError ? (
            <p style={{ color: 'red', textAlign: 'center', height: '100%' }}>ไม่พบหอพักของคุณ</p>
          ) : (
            <div style={{ textAlign: 'center', height: '50%' }}>
              <p>ในกรณีที่ท่านยังไม่ลงประกาศหอพัก สามารถเข้าไปประกาศหอพักของท่าน ได้ที่นี่</p>
              <br />
              <a
                href="/formdorm"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  color: 'black',
                  height: '50%',
                }}
              >
                <FontAwesomeIcon icon={faFileCirclePlus} style={{ marginBottom: '5px', height: '10vh' }} />
              </a>
              <br />
              <Nav.Item>
                <Nav.Link eventKey="tab1" onClick={handleShowList}>
                  คลิกที่นี่ เพื่อดูรายการประกาศหอพัก
                </Nav.Link>
              </Nav.Item>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <br />
          <Table striped bordered style={{ width: '100%' }}>

            <thead style={{ textAlign: 'center' }} >
              <tr>
                <th></th>
                <th>ชื่อหอพัก (ไทย)</th>
                <th>ชื่อหอพัก (อังกฤษ)</th>
                <th>อีเมล</th>
                <th>เบอร์โทร</th>
                <th>ไลน์</th>
                <th>สถานะหอพัก</th>
              </tr>
            </thead>

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
                      to={`/customerreserve/${listing._id}`}
                    >
                      รายการจองของลูกค้า
                    </Link>
                  </td>

                  <td>
                    {listing.tname ? (
                      <span
                        style={{
                          color: '#374151',
                          fontWeight: '300',
                          textDecoration: 'none',
                          display: 'block',
                          margin: '3vh',
                          textAlign: 'center',
                        }}
                      >
                        {listing.tname}
                      </span>
                    ) : (
                      <span
                        style={{
                          color: '#374151',
                          fontWeight: '300',
                          textDecoration: 'none',
                          display: 'block',
                          margin: '3vh',
                          textAlign: 'center',
                        }}
                      >
                        ไม่พบข้อมูล
                      </span>
                    )}
                  </td>

                  <td>
                    {listing.ename ? (
                      <span
                        style={{
                          color: '#374151',
                          fontWeight: '300',
                          textDecoration: 'none',
                          display: 'block',
                          margin: '3vh',
                          textAlign: 'center',
                        }}
                      >
                        {listing.ename}
                      </span>
                    ) : (
                      <span
                        style={{
                          color: '#374151',
                          fontWeight: '300',
                          textDecoration: 'none',
                          display: 'block',
                          margin: '3vh',
                          textAlign: 'center',
                        }}
                      >
                        ไม่พบข้อมูล
                      </span>
                    )}
                  </td>

                  <td>
                    {listing.email ? (
                      <span
                        style={{
                          color: '#374151',
                          fontWeight: '300',
                          textDecoration: 'none',
                          display: 'block',
                          margin: '3vh',
                          textAlign: 'center',
                        }}
                      >
                        {listing.email}
                      </span>
                    ) : (
                      <span
                        style={{
                          color: '#374151',
                          fontWeight: '300',
                          textDecoration: 'none',
                          display: 'block',
                          margin: '3vh',
                          textAlign: 'center',
                        }}
                      >
                        ไม่พบข้อมูล
                      </span>
                    )}
                  </td>

                  <td>
                    {listing.phone ? (
                      <span
                        style={{
                          color: '#374151',
                          fontWeight: '300',
                          textDecoration: 'none',
                          display: 'block',
                          margin: '3vh',
                          textAlign: 'center',
                        }}
                      >
                        {listing.phone}
                      </span>
                    ) : (
                      <span
                        style={{
                          color: '#374151',
                          fontWeight: '300',
                          textDecoration: 'none',
                          display: 'block',
                          margin: '3vh',
                          textAlign: 'center',
                        }}
                      >
                        ไม่พบข้อมูล
                      </span>
                    )}
                  </td>

                  <td>
                    {listing.line ? (
                      <span
                        style={{
                          color: '#374151',
                          fontWeight: '300',
                          textDecoration: 'none',
                          display: 'block',
                          margin: '3vh',
                          textAlign: 'center',
                        }}
                      >
                        {listing.line}
                      </span>
                    ) : (
                      <span
                        style={{
                          color: '#374151',
                          fontWeight: '300',
                          textDecoration: 'none',
                          display: 'block',
                          margin: '3vh',
                          textAlign: 'center',
                        }}
                      >
                        ไม่พบข้อมูล
                      </span>
                    )}
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <table style={{ margin: 'auto' }}>
                      <tbody>
                        <tr>
                          <td style={{ textAlign: 'center' }}>
                            <p style={{ marginBottom: 0 }}>สถานะหอพัก:</p>
                          </td>
                          <td style={{ textAlign: 'center', padding: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <span
                                style={{
                                  marginRight: '10px',
                                  color: statusMessage === 'หอพักเต็ม' ? 'red' : 'black',
                                }}
                              >
                                {statusMessage === 'หอพักว่าง' ? 'ว่าง' : 'เต็ม'}
                              </span>

                              <Form.Check
                                type="switch"
                                label=""
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  margin: 'auto',
                                }}
                                onClick={() => handleToggle(listing._id)}
                              />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>

                  <td style={{ textAlign: 'center' }}>

                    <Link
                      to={`/update/${listing._id}`}
                      style={{
                        color: '#FFFFFF',
                        borderRadius: '5px',
                        display: 'inline-block',
                        padding: '8px 16px',
                        textDecoration: 'none',
                        backgroundColor: '#54A915',
                        margin: '2vh',
                      }}
                    >
                      <FontAwesomeIcon icon={faEdit} style={{ marginRight: '8px' }} /> เเก้ไข
                    </Link>

                    <Button onClick={() => handleListDelete(listing._id)}
                      style={{
                        color: '#FFFFFF',
                        borderRadius: '5px',
                        margin: '1vh',
                        backgroundColor: '#DF130C',
                        border: 'none',
                        padding: '8px 16px'
                      }}>
                      <FontAwesomeIcon icon={faTrash} style={{ marginRight: '8px' }} />
                      ลบ
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default Reserve;