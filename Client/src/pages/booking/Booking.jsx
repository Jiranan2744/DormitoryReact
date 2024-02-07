import React, { useContext, useState, useEffect } from 'react';
import './booking.css';
import useFetch from '../../hooks/useFetch';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChair,
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faDumbbell,
  faElevator,
  faFan,
  faLocationDot,
  faSquareParking,
  faTemperatureArrowUp,
  faTv,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/navbar/Navbar";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { Input } from '@mui/material';
import axios from 'axios';
import QRCode from 'qrcode.react';

const generatePayload = require('promptpay-qr');

const Booking = () => {
  const location = useLocation();
  const [userDetail, setUserDetail] = useState({});
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [amount, setAmount] = useState(200.00);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);
  const [qrCode, setqrCode] = useState("sample");
  const handleClose = () => {
    setStep(1)
    setShow(false)
  };
  const handleShow = () => setShow(true);

  const { data, loading, error } = useFetch(`/dormitorys/find/${id}`);


  const navigate = useNavigate()

  const nextProcess = () => {
    setqrCode(generatePayload(data.phone, { amount }));
    setStep((prevStep) => prevStep + 1);
  }

  useEffect(() => {
    axios.get("/users/getuser").then((data) => {
      data.data.phone = `0${data.data.phone}`
      console.log(data)
      setUserDetail(data.data)
    }).catch((err) => {
      console.log(err)
    })

  }, []);

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };

  console.log(data)




  return (
    <div>
      <Navbar />
      {loading ? (
        "Loading"
      ) : error ? (
        "Error loading data"
      ) : (

        <div className="hotelContainer">
          {open && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleMove("l")}
              />
              <div className="slideWrapper">
                <img
                  src="{data.image[slideNumber]"
                  alt=""
                  className="sliderImg"
                />
              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}

          <div className="hotelWrapper">
            <button className="bookPhone">Tel: {data.phone}</button>
            <button className="bookLine">Line ID: {data.line}</button>

            <h1 className="hotelTitle">{data.tname} {data.ename} {data.title}</h1>

            <div className="hotelAddress">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{data.no} {data.street} {data.road} {data.district} {data.subdistrict} {data.province} {data.code}</span>
            </div>

            <span className="hotelPriceHighlight">
              Book a stay over ${data.cheapestPrice} at this property and get a
              free airport taxi
            </span>

            {/* Image */}
            <div className="hotelImages">
              {data.image?.map((images, i) => (
                <div className="hotelImgWrapper" key={i}>
                  <img
                    onClick={() => handleOpen(i)}
                    src={images}
                    alt=""
                    className="hotelImg"
                  />
                </div>
              ))}
            </div>


            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <div>
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>ประเภทห้อง</th>
                        <th>ขนาดห้องพัก</th>
                        <th>ค่าเช่ารายเดือน</th>
                        <th>ค่าเช่ารายวัน</th>
                        <th>สถานะห้องพัก</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{data.typeRooms}</td>
                        <td>{data.sizeRooms}</td>
                        <td>{data.minMonthly} - {data.maxMonthly}</td>
                        <td>{data.minDaily} - {data.maxDaily}</td>
                        <td>
                          <div className='statusRoom'>
                            <span>ห้องว่าง</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <br />  <br /> <br />

                  <div style={{ width: '100vh', height: '30vh', alignItems: 'left', justifyContent: 'center' }}>

                    <h1>สิ่งอำนวยความสะดวก</h1>
                    <div className="icon">
                      <FontAwesomeIcon icon={faFan} />
                      <span>เครื่องปรับอากาศ</span>
                    </div>
                    <div className="icon">
                      <FontAwesomeIcon icon={faChair} />
                      <span>เฟอร์นิเจอร์-ตู้-เตียง</span>
                    </div>
                    <div className="icon">
                      <FontAwesomeIcon icon={faTemperatureArrowUp} />
                      <span>เครื่องทำน้ำอุ่น</span>
                    </div>
                    <div className="icon">
                      <FontAwesomeIcon icon={faFan} />
                      <span>พัดลม</span>
                    </div>
                    <div className="icon">
                      <FontAwesomeIcon icon={faTv} />
                      <span>TV</span>
                    </div>
                    <div className="icon">
                      <FontAwesomeIcon icon={faSquareParking} />
                      <span>ที่จอดรถ</span>
                    </div>
                    <div className="icon">
                      <FontAwesomeIcon icon={faElevator} />
                      <span>ลิฟต์</span>
                    </div>
                    <div className="icon">
                      <FontAwesomeIcon icon={faDumbbell} />
                      <span>ฟิตเนส</span>
                    </div>
                    <div className="icon">
                      <FontAwesomeIcon icon={faWifi} />
                      <span>อินเทอร์เน็ตไร้สาย (WIFI)</span>
                    </div>
                  </div>
                </div>
              </div>



              <div className="hotelDetailsPrice">
                <h1 style={{ fontWeight: 'bold' }}> รายละเอียดห้องพัก </h1>


                <Button variant="primary" onClick={handleShow}>
                  Reserve or Book Now!
                </Button>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title style={{ display: 'flex', color: '#000000', alignItems: 'center', justifyContent: 'center' }}>
                      จองห้องพัก
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {step === 1 && (
                      <Form>
                        <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                          <Form.Label style={{ display: 'flex', fontWeight: 'bold', fontSize: '20px', color: '#003580' }}>ข้อมูลผู้จอง</Form.Label>
                          <Form.Control style={{ margin: '10px' }} type="name" value={`${userDetail.firstname} ${userDetail.lastname}`} readOnly placeholder="ชื่อ - นามสกุล" autoFocus />
                          <Form.Control style={{ margin: '10px' }} type="email" value={userDetail.email} readOnly placeholder="อีเมลล์" autoFocus />
                          <Form.Control style={{ margin: '10px' }} type="text" value={userDetail.phone} readOnly placeholder="เบอร์โทร" autoFocus />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                          <Form.Label style={{ display: 'flex', fontWeight: 'bold', fontSize: '20px', color: '#003580' }}>ประเภทห้องพัก</Form.Label>
                          <Form>
                            <Row>
                              <Col>
                                <Form.Control
                                  type="text"
                                  style={{ margin: '10px', width: '35vh' }}
                                  placeholder={`ประเภทห้องพัก: ${data.typeRooms}`}
                                  aria-label="Disabled input example"
                                  disabled
                                  readOnly
                                />

                              </Col>
                              <Col>
                                <Form.Control
                                  type="text"
                                  style={{ margin: '10px', width: '30vh' }}
                                  placeholder={`ขนาดห้องพัก: ${data.sizeRooms}`}
                                  aria-label="Disabled input example"
                                  disabled
                                  readOnly
                                />
                              </Col>
                            </Row>
                            <Form.Select aria-label="Default select example" style={{ width: '20vh', margin: '10px' }}>
                              <option>ราคาห้องพัก</option>
                              <option value="รายเดือน">รายเดือน</option>
                              <option value="รายวัน">รายวัน</option>
                            </Form.Select>
                          </Form>
                          <Form.Group>
                          </Form.Group>
                        </Form.Group>
                      </Form>
                    )}
                    {step === 2 && (
                      <Form>
                        <div className='d-flex mb-5 flex-column justify-content-center align-items-center'>
                          <h3 className='pb-4'>Prompay QR Code</h3>
                          <QRCode size={250} value={qrCode} />
                          <Form>
                            <Form.Group controlId="formFile" className="mb-3 text-center mt-4">
                              <Form.Label>กรุณาแนบสลิป หลังจากชำระเงิน</Form.Label>
                              <Form.Control type="file" />
                            </Form.Group>
                          </Form>
                        </div>
                      </Form>
                    )}
                  </Modal.Body>

                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" type="submit" onClick={nextProcess}>
                      Next
                    </Button>
                  </Modal.Footer>
                </Modal>

              </div>
            </div>


          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
