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
  faTrashCan,
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

import { app } from '../../firebase';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

const generatePayload = require('promptpay-qr');

const Booking = () => {
  const location = useLocation();
  const [userDetail, setUserDetail] = useState({});
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);
  const [amount, setAmount] = useState(500.00);
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
  const [files, setFiles] = useState([]);

  const [formData, setFormData] = useState({
    image: [],
    imagePayment: [],
  })

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imagePayment.length < 2) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormData({
          ...formData, imagePayment: formData.imagePayment.concat(urls),
        });
        setImageUploadError(false);
        setUploading(false);
      }).catch((err) => {
        setImageUploadError('การอัปโหลดรูปภาพล้มเหลว (สูงสุด 2 MB ต่อภาพ)');
        setUploading(false);
      });
    } else {
      setImageUploadError('คุณสามารถอัปโหลดได้เพียง 1 ภาพต่อรายการ')
      setUploading(false);
    }
  };


  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      )
    })
  }

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imagePayment: formData.imagePayment.filter((_, i) => i !== index),
    });
  };


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
            <Button className="bookPhone" style={{ backgroundColor: '#FEBA02' }} disabled>Tel: {data.phone}</Button>
            <Button className="bookLine" style={{ backgroundColor: '#FEBA02' }} disabled>Line ID: {data.line}</Button>

            <h1 className="hotelTitle">{data.tname} {data.ename} {data.title}</h1>

            <div className="hotelAddress">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{data.no} {data.street} {data.road} {data.district} {data.subdistrict} {data.province} {data.code}</span>
            </div>

            <span className="hotelPriceHighlight">
              Book a stay over ${data.cheapestPrice} at this property and get a
              free airport taxi
            </span>
            <br />
            {/* Image */}
            <div className="hotelImages">
              {data.image?.map((images, i) => (
                <div className="hotelImgWrapper" key={i}>
                  <img
                    // onClick={() => handleOpen(i)}
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
                        <th>ค่าเช่ารายวัน</th>
                        <th>ค่าเช่ารายเดือน</th>                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{data.typeRooms}</td>
                        <td>{data.sizeRooms}</td>
                        <td>{data.minDaily} - {data.maxDaily}</td>
                        <td>{data.minMonthly} - {data.maxMonthly}</td>
                      </tr>
                    </tbody>
                  </table>
                  <br />  <br />

                  <div style={{ width: '100vh', height: '30vh', alignItems: 'left', justifyContent: 'center' }}>
                    <h1>สิ่งอำนวยความสะดวก</h1>
                    <div className="icon-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', padding: '20px' }}>
                      <div className="icon-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="icon" style={{ textAlign: 'center', margin: '10px' }}>
                          <FontAwesomeIcon icon={faFan} />
                          <span>เครื่องปรับอากาศ</span>
                        </div>
                        <div className="icon" style={{ textAlign: 'center', margin: '10px' }}>
                          <FontAwesomeIcon icon={faChair} />
                          <span>เฟอร์นิเจอร์-ตู้-เตียง</span>
                        </div>
                        <div className="icon" style={{ textAlign: 'center', margin: '10px' }}>
                          <FontAwesomeIcon icon={faTemperatureArrowUp} />
                          <span>เครื่องทำน้ำอุ่น</span>
                        </div>
                        <div className="icon" style={{ textAlign: 'center', margin: '10px' }}>
                          <FontAwesomeIcon icon={faFan} />
                          <span>พัดลม</span>
                        </div>
                      </div>

                      <div className="icon-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="icon" style={{ textAlign: 'center', margin: '10px' }}>
                          <FontAwesomeIcon icon={faTv} />
                          <span>TV</span>
                        </div>
                        <div className="icon" style={{ textAlign: 'center', margin: '10px' }}>
                          <FontAwesomeIcon icon={faSquareParking} />
                          <span>ที่จอดรถ</span>
                        </div>
                        <div className="icon" style={{ textAlign: 'center', margin: '10px' }}>
                          <FontAwesomeIcon icon={faElevator} />
                          <span>ลิฟต์</span>
                        </div>
                        <div className="icon" style={{ textAlign: 'center', margin: '10px' }}>
                          <FontAwesomeIcon icon={faDumbbell} />
                          <span>ฟิตเนส</span>
                        </div>
                      </div>

                      <div className="icon-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="icon" style={{ textAlign: 'center', margin: '10px' }}>
                          <FontAwesomeIcon icon={faWifi} />
                          <span>อินเทอร์เน็ตไร้สาย (WIFI)</span>
                        </div>
                        <div className="icon" style={{ textAlign: 'center', margin: '10px' }}>
                          <FontAwesomeIcon icon={faWifi} />
                          <span>อินเทอร์เน็ตไร้สาย (WIFI)</span>
                        </div>
                      </div>

                    </div>
                    <div className="" style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
                      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>รายละเอียด</h1>
                      <span style={{ fontSize: '16px', color: '#333' }}>{data.description}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hotelDetailsPrice">
                <h1 style={{ fontWeight: 'bold' }}> รายละเอียดหอพัก </h1>

                <table className="table table-hover">

                  <tbody>
                    <tr>
                      <td>ค่าน้ำ: {data.billWater} บาท/ยูนิต</td>
                    </tr>
                    <tr>
                      <td>ค่าไฟ: {data.billElectrict} บาท/ยูนิต</td>
                    </tr>
                    <tr>
                      <td>เงินประกัน: {data.insurance} บาท</td>
                    </tr>
                    <tr>
                      <td>ค่ามัดจำ: {data.advance} บาท
                        <p>ล่วงหน้า 1 เดือน</p>
                      </td>
                    </tr>
                    <tr>
                      <td>ค่าส่วนกลาง: {data.service} บาท</td>
                    </tr>
                    <tr>
                      <td>ค่าโทรศัพท์: {data.billInternet} บาท</td>
                    </tr>
                    <tr>
                      <td>ค่าอินเทอร์เน็ต: {data.billTelephone} บาท</td>
                    </tr>
                  </tbody>
                </table>


                <Button style={{ backgroundColor: '#003580' }} onClick={handleShow}>
                  จองหอพัก
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
                          <Form.Control style={{ marginTop: '10px', width: '100%' }} type="name" value={`${userDetail.firstname} ${userDetail.lastname}`} disabled readOnly placeholder="ชื่อ - นามสกุล" autoFocus />
                          <Form.Control style={{ marginTop: '10px', width: '100%' }} type="email" value={userDetail.email} disabled readOnly placeholder="อีเมล์" autoFocus />
                          <Form.Control style={{ marginTop: '10px', width: '100%' }} type="text" value={userDetail.phone} disabled readOnly placeholder="เบอร์โทร" autoFocus />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                          <Form.Label style={{ display: 'flex', fontWeight: 'bold', fontSize: '20px', color: '#003580' }}>ประเภทห้องพัก</Form.Label>
                          <Form>
                            <Row>
                              <Form.Control
                                type="text"
                                style={{ marginLeft: '10px', width: '30%', height: '5vh' }}
                                placeholder={`ห้องพัก: ${data.typeRooms}`}
                                aria-label="Disabled input example"
                                disabled
                                readOnly
                              />
                              <Col>
                                <Form.Control
                                  type="text"
                                  style={{ marginLeft: '20px', width: '55%', height: '5vh' }}
                                  placeholder={`ขนาดห้องพัก: ${data.sizeRooms}`}
                                  aria-label="Disabled input example"
                                  disabled
                                  readOnly
                                />
                              </Col>
                              <br /><br />
                              <Row>
                                <Form.Control
                                  type="text"
                                  style={{ marginLeft: '10px', width: '32%', height: '5vh' }}
                                  placeholder={`ค่ามัดจำ: ${data.advance}`}
                                  aria-label="Disabled input example"
                                  disabled
                                  readOnly
                                />
                              </Row>
                            </Row>
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
                              <input
                                type="file"
                                id='imagePayment'
                                accept='image/*'
                                className='form-control'
                                multiple
                                onChange={(e) => setFiles(e.target.files)}
                              />
                              <br />
                              <button
                                type='button'
                                disabled={uploading}
                                className='btn btn-primary p-2 mx-2'
                                style={{ color: 'white' }}
                                onClick={handleImageSubmit}
                              >
                                {uploading ? 'Uploading...' : 'Upload'}
                              </button>
                              <p style={{ color: 'red' }}>{imageUploadError && imageUploadError}</p>
                              {
                                formData.imagePayment.length > 0 && formData.imagePayment.map((url, index) => (
                                  <div
                                    key={url}
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                    className='p-3 items-center'>
                                    <p>อัพโหลดเสร็จสิ้น</p>
                                    <div
                                      type="button"
                                      onClick={() => handleRemoveImage(index)}
                                      className="rounded-lg uppercase hover:opacity-75"
                                      style={{ backgroundColor: 'transparent', color: 'red' }}
                                    >
                                      <FontAwesomeIcon icon={faTrashCan} style={{ marginRight: '8px' }} />
                                      Delete
                                    </div>
                                  </div>
                                ))
                              }
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
