import React, { useState, useEffect } from 'react';
import './booking.css';
import useFetch from '../../hooks/useFetch';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import QRCode from 'qrcode.react';

import { app } from '../../firebase';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { useSelector } from 'react-redux';

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

  console.log(userDetail._id)
  const handleClose = () => {
    setStep(1)
    setShow(false)
  };
  const handleShows = () => setShow(true);

  const { currentUser } = useSelector((state) => state.user);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  const { data } = useFetch(`/dormitorys/find/${id}`);
  const [files, setFiles] = useState([]);

  console.log(data)

  const [formData, setFormData] = useState({
    imagePayment: [],
    isReservationEnabled: '',
  })

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const listingId = params.listingId;

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


  const getDormitoryId = () => {
    const pathArray = window.location.pathname.split('/');
    const dormId = pathArray[pathArray.length - 1];

    return dormId;
  };

  // Function to handle reservation success
  const handleReservationSuccess = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);

      // If there are no images, set imagePayment to null
      const imagePayment = formData.imagePayment.length > 0 ? formData.imagePayment : null;

      // Retrieve dormitory ID from the current page or component
      const dormId = getDormitoryId();

      // Retrieve user ID from your authentication system (assuming currentUser is correctly set)
      const userId = currentUser._id;

      // Send a POST request to the server
      const res = await fetch(`/reservation/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dormitoryId: dormId,
          userId: userId,
          imagePayment,
          // ... other fields
        }),
      });

      // Parse the response from the server
      const responseData = await res.json();
      setLoading(false);

      // Handle the response
      if (responseData.success === false) {
        setError(responseData.message);
      } else {
        // Reservation created successfully
        // Navigate to the desired page (adjust as needed)
      }
    } catch (error) {
      console.error("Error in handleReservationSuccess:", error);
      setError(error.message);
      setLoading(false);
    }
  };


  const [facilities, setFacilities] = useState([]);
  const [dormitoryId, setDormitoryId] = useState();

  useEffect(() => {
    // Fetch facilities data from your API
    fetch(`/dormitorys/optionselect/${params.id}`)
      .then(response => response.json())
      .then(data => {
        // Ensure data is an array before setting the state
        if (Array.isArray(data)) {
          setFacilities(data);
        }
      })
      .catch(error => console.error('Error fetching facilities:', error));
  }, [dormitoryId]);


  const [isDormitoryOpen, setIsDormitoryOpen] = useState(true);

  const handleShow = () => {
    if (isDormitoryOpen) {
      // Dormitory is open, handle the logic for showing the reservation details or navigating to the reservation page
      // You can replace this with your actual logic
      console.log('Redirecting to reservation page...');
      // Add logic to show the modal if needed
      setShow(true);
    } else {
      // Dormitory is closed, display a message to the user
      alert('The dormitory is currently closed or full. Reservations are not available.');
    }
  };


  useEffect(() => {
    const fetchDormitoryStatus = async () => {
      try {
        const response = await fetch(`/dormitorys/${params.id}/save-status`);
        const dormitoryStatus = await response.json();
        setIsDormitoryOpen(dormitoryStatus.active && dormitoryStatus.isReservationEnabled);
      } catch (error) {
        console.error('Error fetching dormitory status:', error);
      }
    };

    fetchDormitoryStatus();
  }, [dormitoryId]);


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


            <br /> <br />
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
                    <thead className="table-light" style={{ textAlign: 'center' }}>
                      <tr>
                        <th>ประเภทห้อง</th>
                        <th>ขนาดห้องพัก</th>
                        <th>ค่าเช่ารายวัน</th>
                        <th>ค่าเช่ารายเดือน</th>
                      </tr>
                    </thead>
                    <tbody style={{ textAlign: 'center' }}>
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
                    <div className="icon-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', padding: '20px' }}>
                      {facilities.map(facility => (
                        <div key={facility._id} className="icon" style={{ textAlign: 'center', margin: '10px' }}>
                          {/* Use the appropriate icon based on your facility data */}
                          {facility.facilities_name === 'ลิฟต์' && <FontAwesomeIcon icon={faElevator} />}
                          {facility.facilities_name === 'เครื่องปรับอากาศ' && <FontAwesomeIcon icon={faFan} />}
                          {facility.facilities_name === 'เฟอร์นิเจอร์-ตู้-เตียง' && <FontAwesomeIcon icon={faChair} />}
                          {facility.facilities_name === 'พัดลม' && <FontAwesomeIcon icon={faFan} />}
                          {facility.facilities_name === 'TV' && <FontAwesomeIcon icon={faTv} />}
                          {facility.facilities_name === 'โทรศัพท์สายตรง' && <FontAwesomeIcon icon={faTv} />}
                          {facility.facilities_name === 'อินเทอร์เน็ตไร้สาย (WIFI)' && <FontAwesomeIcon icon={faTv} />}
                          {facility.facilities_name === 'เครื่องทำน้ำอุ่น' && <FontAwesomeIcon icon={faTemperatureArrowUp} />}
                          {facility.facilities_name === 'มีระบบรักษาความปลอดภัย (คีย์การ์ด)' && <FontAwesomeIcon icon={faWifi} />}
                          {facility.facilities_name === 'มีระบบรักษาความปลอดภัย (สเเกนลายนิ้วมือ)' && <FontAwesomeIcon icon={faWifi} />}
                          {facility.facilities_name === 'กล้องวงจรปิด (CCTV)' && <FontAwesomeIcon icon={faWifi} />}
                          {facility.facilities_name === 'รปภ.' && <FontAwesomeIcon icon={faWifi} />}
                          {facility.facilities_name === 'ที่จอดรถ' && <FontAwesomeIcon icon={faSquareParking} />}
                          {facility.facilities_name === 'ที่จอดรถมอเตอร์ไซต์/จักรยาน' && <FontAwesomeIcon icon={faSquareParking} />}
                          {facility.facilities_name === 'สระว่ายน้ำ' && <FontAwesomeIcon icon={faWifi} />}
                          {facility.facilities_name === 'ฟิตเนส' && <FontAwesomeIcon icon={faDumbbell} />}
                          {facility.facilities_name === 'ร้านขายอาหาร' && <FontAwesomeIcon icon={faWifi} />}
                          {facility.facilities_name === 'ร้านค้า สะดวกซื้อ' && <FontAwesomeIcon icon={faWifi} />}
                          {facility.facilities_name === 'ร้านซัก-รีด' && <FontAwesomeIcon icon={faWifi} />}
                          {facility.facilities_name === 'ร้านทำผม-เสริมสวย' && <FontAwesomeIcon icon={faWifi} />}
                          {facility.facilities_name === 'อนุญาติให้สูบบุหรี่ในห้องพัก' && <FontAwesomeIcon icon={faWifi} />}
                          {facility.facilities_name === 'อนุญาติให้เลี้ยงสัตว์' && <FontAwesomeIcon icon={faWifi} />}

                          {facility.facilities_name && <span>{facility.facilities_name}</span>}
                        </div>
                      ))}
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

                <Button
                  style={{
                    backgroundColor: isDormitoryOpen ? '#003580' : '#003580',
                    color: 'white', // Set the text color to white for better visibility
                  }}
                  onClick={handleShow}
                  disabled={!isDormitoryOpen}
                >
                  {isDormitoryOpen ? 'กดจองหอพัก' : 'หอพักเต็ม'}
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

                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        ปิด
                      </Button>

                      {step === 1 && (
                        <Button variant="primary" type="submit" onClick={nextProcess}>
                          ถัดไป
                        </Button>
                      )}

                      {step !== 1 && (
                        <Button variant="primary" type="submit" onClick={handleReservationSuccess}>
                          ยืนยันการจอง
                        </Button>
                      )}
                    </Modal.Footer>
                  </Modal.Body>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </div >
  );
};

export default Booking;
