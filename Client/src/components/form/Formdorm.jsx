import React, { useEffect, useState } from 'react';

import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom'
import Navbar from "../../components/navbar/Navbar";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

import { app } from '../../firebase';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/esm/Button';
import FormSelect from 'react-bootstrap/esm/FormSelect';

export default function Formdorm() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    image: [],
    tname: '',
    ename: '',
    email: '',
    phone: '',
    line: '',
    no: '',
    street: '',
    road: '',
    district: '',
    subdistrict: '',
    province: '',
    code: '',
    description: '',
    typeRooms: '',
    sizeRooms: '',
    mindaily: '',
    maxdaily: '',
    minmonthly: '',
    maxmonthly: '',
    billWater: '',
    billElectrict: '',
    insurance: '',
    advance: '',
    billInternet: '',
    billTelephone: '',
    service: '',
    facilities: [],
  })

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  //เพิ่มประเภทห้องพัก
  const [savedRoomData, setSavedRoomData] = useState(null);

  const [newRoomData, setNewRoomData] = useState({
    typeRooms: "",
    sizeRooms: "",
    minDaily: "",
    maxDaily: "",
    minMonthly: "",
    maxMonthly: "",
  });

  const handleSaveRoom = async () => {
    try {
      // Assuming you have an API endpoint to handle dormitory creation
      const response = await fetch('/dormitorys/newroom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoomData),
      });

      if (response.ok) {
        // Handle success, e.g., close the modal
        handleCloseModal();
      } else {
        // Handle error
        console.error('Failed to save room data');
      }
    } catch (error) {
      console.error('Error saving room data:', error);
    }
  };


  console.log(formData);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.image.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises).then((urls) => {
        setFormData({
          ...formData, image: formData.image.concat(urls),
        });
        setImageUploadError(false);
        setUploading(false);
      }).catch((err) => {
        setImageUploadError('การอัปโหลดรูปภาพล้มเหลว (สูงสุด 2 MB ต่อภาพ)');
        setUploading(false);
      });
    } else {
      setImageUploadError('คุณสามารถอัปโหลดได้สูงสุด 6 ภาพต่อรายการ')
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
      image: formData.image.filter((_, i) => i !== index),
    });
  };

  //HandleChange
  const handleChange = (e) => {
    const allowedTypes = ['number', 'text', 'textarea'];

    if (allowedTypes.includes(e.target.type)) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };


  //เลือกประเภทห้อง
  const handleChangeType = (e) => {
    const selectedRoomType = e.target.value;

    // Update formData with the selected room type
    setFormData({
      ...formData,
      typeRooms: selectedRoomType,
    });
  };


  const navigate = useNavigate();

  //CREATE DORMITORYS
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(false);

      const selectedFacilities = selectedOptions.map((facilityId) => ({ _id: facilityId }));

      const res = await fetch('/dormitorys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
          facilities: selectedFacilities,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
      } else {
        // Navigate only if there is no error
        navigate(`/booking/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };


  //Checkbox
  const [facilities, setFacilities] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    fetch('/dormitorys/getOptions')
      .then(response => response.json())
      .then(data => setFacilities(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleCheckboxChange = (optionId) => {
    const isSelected = selectedOptions.includes(optionId);

    if (isSelected) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

  //สถานะหอพัก (เปิด-ปิด) 
  const [isToggled, setIsToggled] = useState(false);
  const [dormitoryId, setDormitoryId] = useState();

  const handleToggle = async () => {
    try {
      const response = await axios.post(`/dormitorys/${dormitoryId}/save-status`, {
        isToggled: !isToggled,
      });

      setIsToggled(response.data.isToggled);
    } catch (error) {
      console.error('Error saving to the database:', error);
    }
  };

  //เพิ่มประเภทหอพัก
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };




  return (
    <div>
      <Navbar />
      < br />
      <div className="d-flex justify-content-center">
        <Card style={{ display: 'flex', border: '2px solid #D4D4D4', width: '70%' }}>
          <Form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'left', justifyContent: 'left' }}>
            <Row>
              <Form.Label column sm={5} style={{ display: 'flex', padding: '30px', fontWeight: 'normal', fontSize: '40px', fontFamily: 'GraphikTH', color: '#666666' }}>
                ลงประกาศหอพักฟรี
              </Form.Label>

              <Form.Group as={Row} className="mb-1" style={{ margin: '10px' }} controlId="formHorizontalTname">
                <Form.Label column sm={5} style={{ width: '30vh', fontWeight: 'normal', fontSize: '20px', color: '#666666' }}>
                  ชื่อที่พัก
                </Form.Label>
                <Col sm={6} style={{ width: '50vh' }}>
                  <input
                    type="text"
                    placeholder="ชื่อ (ภาษาไทย)"
                    id="tname"
                    className='form-control'
                    onChange={handleChange}
                    value={formData.tname}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-1" style={{ margin: '10px' }} controlId="formHorizontalEname">
                <Form.Label codvlumn sm={5} style={{ display: 'flex', width: '30vh', height: '', fontWeight: 'normal', fontSize: '20px', color: '#666666' }}>
                  ชื่อที่พัก (English)
                </Form.Label>
                <Col sm={6} style={{ width: '50vh' }}>
                  <input
                    type="text"
                    placeholder="ชื่อ (ภาษาอังกฤษ)"
                    id="ename"
                    className='form-control'
                    onChange={handleChange}
                    value={formData.ename}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-1" style={{ margin: '10px' }} controlId="formHorizontalEmail">
                <Form.Label column sm={5} style={{ display: 'flex', width: '30vh', fontWeight: 'normal', fontSize: '20px', color: '#666666' }}>
                  อีเมล
                </Form.Label>
                <Col sm={6} style={{ width: '50vh' }}>
                  <input
                    type="text"
                    placeholder="อีเมล"
                    id="email"
                    className='form-control'
                    onChange={handleChange}
                    value={formData.email}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-1" style={{ margin: '10px' }} controlId="formHorizontalEmail">
                <Form.Label column sm={5} style={{ display: 'flex', width: '30vh', fontWeight: 'normal', fontSize: '20px', color: '#666666' }}>
                  เบอร์โทร
                </Form.Label>
                <Col sm={6} style={{ width: '50vh' }}>
                  <input
                    type="text"
                    placeholder="เบอร์โทร"
                    id="phone"
                    className='form-control'
                    onChange={handleChange}
                    value={formData.phone}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-1" style={{ margin: '10px' }} controlId="formHorizontalEmail">
                <Form.Label column sm={5} style={{ display: 'flex', width: '30vh', fontWeight: 'normal', fontSize: '20px', color: '#666666' }}>
                  Line ID
                </Form.Label>
                <Col sm={6} style={{ width: '50vh' }}>
                  <input
                    type="text"
                    placeholder="ไลน์"
                    id="line"
                    className='form-control'
                    onChange={handleChange}
                    value={formData.line}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="" style={{ margin: '5px', }} controlId="formHorizontalAddress">
                <Form.Group as={Col} controlId="formGridCity">
                  <Row className="mt-2 pb-1" xs={5}>
                    <Form.Label column sm={3} style={{ width: '30vh', padding: '15px', fontWeight: 'normal', fontSize: '20px', color: '#666666' }}>
                      ที่อยู่
                    </Form.Label>

                    <Col>
                      <Form.Label>เลขที่/หมู่</Form.Label>
                      <Form.Group as={Col} controlId="formGridNumber">
                        <input
                          type="text"
                          placeholder="เลขที่/หมู่."
                          id="no"
                          style={{ width: '20vh' }}
                          className='form-control'
                          onChange={handleChange}
                          value={formData.no}
                        />
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Label>ถนน</Form.Label>
                      <Form.Group as={Col} controlId="formGridNumber">
                        <input
                          type="text"
                          placeholder="ถนน."
                          id="road"
                          style={{ width: '20vh' }}
                          className='form-control'
                          onChange={handleChange}
                          value={formData.road}
                        />
                      </Form.Group>
                    </Col>

                    <Col>
                      <Form.Label>ซอย</Form.Label>
                      <Form.Group as={Col} controlId="formGridNumber">
                        <input
                          type="text"
                          placeholder="ซอย."
                          id="street"
                          style={{ width: '20vh' }}
                          className='form-control'
                          onChange={handleChange}
                          value={formData.street}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group>
                    <Row className="mt-2 pb-1" xs={5}>
                      <Form.Label column sm={3} style={{ width: '30vh' }}></Form.Label>
                      <Form.Group as={Col} controlId="formGridAdistrict">
                        <Form.Label>ตำบล/แขวง</Form.Label>
                        <input
                          type="text"
                          placeholder="ตำบล/แขวง."
                          id="subdistrict"
                          style={{ width: '20vh' }}
                          className='form-control'
                          onChange={handleChange}
                          value={formData.subdistrict}
                        />
                      </Form.Group>

                      <Form.Group as={Col} controlId="formGridProvince">
                        <Form.Label>อำเภอ/เขต</Form.Label>
                        <input
                          type="text"
                          placeholder="อำเภอ/เขต."
                          id="district"
                          style={{ width: '20vh' }}
                          className='form-control'
                          onChange={handleChange}
                          value={formData.district}
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridZipcode">
                        <Form.Label>จังหวัด</Form.Label>
                        <input
                          type="text"
                          placeholder="จังหวัด."
                          id="province"
                          style={{ width: '20vh' }}
                          className='form-control'
                          onChange={handleChange}
                          value={formData.province}
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridZipcode">
                        <Form.Label>รหัสไปรษณีย์</Form.Label>
                        <input
                          type="text"
                          placeholder="รหัสไปรษณีย์."
                          id="code"
                          style={{ width: '20vh' }}
                          className='form-control'
                          onChange={handleChange}
                          value={formData.code}
                        />
                      </Form.Group>
                    </Row>
                  </Form.Group>
                  < br /> < br />

                  <Form>
                    <Form.Group>
                      <Form.Label column sm={3} style={{ width: '30vh', padding: '5px', fontWeight: 'normal', fontSize: '20px', color: '#666666' }}>
                        สิ่งอำนวยความสะดวก
                      </Form.Label>
                      <Row style={{ padding: '5px' }}>
                        <Col xs="4" className="my-1">
                          {facilities.slice(0, Math.ceil(facilities.length / 2)).map((facility) => (
                            <Form.Check
                              key={facility._id}
                              type="checkbox"
                              id={`checkbox-${facility._id}`}
                              label={facility.facilities_name}
                              checked={selectedOptions.includes(facility._id)}
                              onChange={() => handleCheckboxChange(facility._id)}
                            />
                          ))}
                        </Col>
                        <Col xs="auto" className="my-1">
                          {facilities.slice(Math.ceil(facilities.length / 2)).map((facility) => (
                            <Form.Check
                              key={facility._id}
                              type="checkbox"
                              id={`checkbox-${facility._id}`}
                              label={facility.facilities_name}
                              checked={selectedOptions.includes(facility._id)}
                              onChange={() => handleCheckboxChange(facility._id)}
                            />
                          ))}
                        </Col>
                      </Row>
                    </Form.Group>
                  </Form>

                  < br />

                  <Form.Label column sm={5} style={{ width: 'auto', fontWeight: 'normal', fontSize: '20px', color: '#666666' }}>
                    ประเภทห้องพัก
                  </Form.Label>

                  <Card style={{ width: '148vh' }}>
                    <Card.Body>
                      <Form>
                        <table style={{ width: '100%', tableLayout: 'fixed' }}> {/* Use fixed table layout */}
                          <thead>
                            <tr style={{ color: '#000000', fontWeight: 'inherit' }}>
                              <th style={{ fontSize: '16px' }}>รูปแบบห้องพัก</th>
                              <th style={{ fontSize: '16px', padding: '15px' }}>ขนาดห้องพัก</th>
                              <th style={{ fontSize: '16px', padding: '15px' }}>ห้องพักรายวัน (บาท/วัน)</th>
                              <th style={{ fontSize: '16px', padding: '15px' }}>ห้องพักรายเดือน (บาท/เดือน)</th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr>
                              <td>
                                <InputGroup className="mb-4">
                                  <FormSelect
                                    id="typeRooms"
                                    className="form-control"
                                    style={{ width: '100px' }}
                                    onChange={handleChangeType}
                                    value={formData.typeRooms}
                                  >
                                    <option value="เลือกห้องพัก">เลือกห้องพัก</option>
                                    <option value="สตูดิโอ">สตูดิโอ</option>
                                    <option value="สูท">สูท</option>
                                    <option value="1 ห้อง">1 ห้อง</option>
                                    <option value="2 ห้อง">2 ห้อง</option>
                                    <option value="3 ห้อง">3 ห้อง</option>
                                  </FormSelect>
                                </InputGroup>
                              </td>

                              <td>
                                <InputGroup className="mb-4 p-3">
                                  <input
                                    type="text"
                                    id="sizeRooms"
                                    placeholder=""
                                    aria-label=""
                                    aria-describedby="basic-addon2"
                                    className="form-control"
                                    onChange={handleChange}
                                    value={formData.sizeRooms}
                                  />
                                  <InputGroup.Text id="basic-addon2">ตร.ม</InputGroup.Text>
                                </InputGroup>
                              </td>

                              <td>
                                <InputGroup className="mb-4 p-3">
                                  <input
                                    type="number"
                                    id="minDaily"
                                    placeholder="ราคาต่ำสุด"
                                    aria-label="ราคาต่ำสุด"
                                    aria-describedby="basic-addon2"
                                    className="form-control"
                                    onChange={handleChange}
                                    value={formData.minDaily}
                                  />
                                  <InputGroup.Text id="basic-addon2">บาท/วัน</InputGroup.Text>
                                </InputGroup>
                              </td>

                              <td>
                                <InputGroup className="mb-4 p-3">
                                  <input
                                    type="number"
                                    id="minMonthly"
                                    placeholder="ราคาต่ำสุด"
                                    aria-label="ราคาต่ำสุด"
                                    aria-describedby="basic-addon2"
                                    className="form-control"
                                    onChange={handleChange}
                                    value={formData.minMonthly}
                                  />
                                  <InputGroup.Text id="basic-addon2">บาท/เดือนk</InputGroup.Text>
                                </InputGroup>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2"></td>

                              <td>
                                <InputGroup className="mb-1 p-3">
                                  <input
                                    type="number"
                                    id="maxDaily"
                                    placeholder="ราคาสูงสุด"
                                    aria-label="ราคาสูงสุด"
                                    aria-describedby="basic-addon2"
                                    className="form-control"
                                    onChange={handleChange}
                                    value={formData.maxDaily}
                                  />
                                  <InputGroup.Text id="basic-addon2">บาท/วัน</InputGroup.Text>
                                </InputGroup>
                              </td>

                              <td>
                                <InputGroup className="mb-1 p-3 h-4">
                                  <input
                                    type="number"
                                    id="maxMonthly"
                                    placeholder="ราคาสูงสุด"
                                    aria-label="ราคาสูงสุด"
                                    aria-describedby="basic-addon2"
                                    className="form-control"
                                    onChange={handleChange}
                                    value={formData.maxMonthly}
                                  />
                                  <InputGroup.Text id="basic-addon2">บาท/เดือน</InputGroup.Text>
                                </InputGroup>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </Form>
                    </Card.Body>
                  </Card>
                  <br />

                  <Card>
                    <Form>
                      {/* Display New Room Type Information */}
                      {newRoomData ? (
                        <div>
                          <h2>New Room Type Information</h2>
                          {/* Display new room type information here */}
                          <p>รูปแบบห้องพัก: {newRoomData.typeRooms}</p>
                          <p>ขนาดห้องพัก: {newRoomData.sizeRooms} ตร.ม</p>
                          <p>ราคาห้องพักรายวัน: {newRoomData.minDaily} - {newRoomData.maxDaily} บาท/วัน</p>
                          <p>ราคาห้องพักรายเดือน: {newRoomData.minMonthly} - {newRoomData.maxMonthly} บาท/เดือน</p>
                        </div>
                      ) : null}
                    </Form>
                  </Card>

                  <br /><br />

                  {/* เพิ่มประเภทห้องพัก */}
                  <div>
                    <Button onClick={handleShowModal}>เพิ่มประเภทห้องพัก</Button>
                    <Modal show={showModal} onHide={handleCloseModal} size="m" style={{ width: 'auto', margin: 'auto', marginLeft: '35%' }} centered>
                      <Modal.Header closeButton>
                        <Modal.Title>เพิ่มประเภทห้องพัก</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form>
                          <Form.Group controlId="formRoomType">
                            <Form.Label>รูปเแบบห้องพัก</Form.Label>
                            <InputGroup style={{ width: '200px', marginTop: '5px', marginBottom: '5px' }}>
                              <FormSelect
                                id="typeRooms"
                                className="form-control"
                                onChange={(e) => setNewRoomData({ ...newRoomData, typeRooms: e.target.value })}
                                value={newRoomData.typeRooms}
                              >
                                <option value="ห้องสตูดิโอ">ห้องสตูดิโอ</option>
                                <option value="ห้องสูท">ห้องสูท</option>
                                <option value="1 ห้อง">1 ห้อง</option>
                                <option value="2 ห้อง">2 ห้อง</option>
                                <option value="3 ห้อง">3 ห้อง</option>
                              </FormSelect>
                            </InputGroup>
                          </Form.Group>

                          <Form.Group controlId="formSizeRoom">
                            <Form.Label>ขนาดห้องพัก</Form.Label>
                            <InputGroup style={{ width: '200px', marginTop: '5px', marginBottom: '5px' }}>
                              <input
                                type="text"
                                id="sizeRooms"
                                placeholder=""
                                aria-describedby="basic-addon2"
                                className="form-control"
                                onChange={(e) => setNewRoomData({ ...newRoomData, sizeRooms: e.target.value })}
                                value={newRoomData.sizeRooms}
                              />
                              <InputGroup.Text id="basic-addon2">ตร.ม</InputGroup.Text>
                            </InputGroup>
                          </Form.Group>

                          <Form.Group controlId="formPriceDaily">
                            <Form.Label>ราคาห้องพักรายวัน</Form.Label>
                            <InputGroup className="mb-2" style={{ width: '430px', marginTop: '5px', marginBottom: '5px' }}>
                              <input
                                type="number"
                                id="minDaily"
                                placeholder="ราคาต่ำสุด"
                                aria-label="ราคาต่ำสุด"
                                aria-describedby="basic-addon2"
                                className="form-control"
                                style={{ borderRadius: '4px 0 0 4px' }}
                                onChange={(e) => setNewRoomData({ ...newRoomData, minDaily: e.target.value })}
                                value={newRoomData.minDaily}
                              />
                              <InputGroup.Text
                                style={{ borderRadius: '0 4px 4px 0' }}
                                id="basic-addon2">บาท/วัน
                              </InputGroup.Text>

                              <input
                                type="number"
                                id="maxDaily"
                                placeholder="ราคาสูงสุด"
                                aria-label="ราคาสูงสุด"
                                aria-describedby="basic-addon2"
                                className="form-control"
                                style={{ marginLeft: '10px', borderRadius: '4px 0 0 4px' }}
                                onChange={(e) => setNewRoomData({ ...newRoomData, maxDaily: e.target.value })}
                                value={newRoomData.maxDaily}
                              />
                              <InputGroup.Text
                                style={{ borderRadius: '0 4px 4px 0' }}
                                id="basic-addon2">บาท/เดือน
                              </InputGroup.Text>
                            </InputGroup>
                          </Form.Group>

                          <Form.Group controlId="formPriceMonthly">
                            <Form.Label>ราคาห้องพักรายเดือน</Form.Label>
                            <InputGroup className="mb-2" style={{ width: '430px', marginTop: '5px', marginBottom: '5px' }}>
                              <input
                                type="number"
                                id="minMonthly"
                                placeholder="ราคาต่ำสุด"
                                aria-label="ราคาต่ำสุด"
                                aria-describedby="basic-addon2"
                                className="form-control"
                                style={{ borderRadius: '4px 0 0 4px' }}
                                onChange={(e) => setNewRoomData({ ...newRoomData, minMonthly: e.target.value })}
                                value={newRoomData.minMonthly}
                              />
                              <InputGroup.Text
                                style={{ borderRadius: '0 4px 4px 0' }}
                                id="basic-addon2">บาท/วัน
                              </InputGroup.Text>

                              <input
                                type="number"
                                id="maxMonthly"
                                placeholder="ราคาสูงสุด"
                                aria-label="ราคาสูงสุด"
                                aria-describedby="basic-addon2"
                                className="form-control"
                                style={{ marginLeft: '10px', borderRadius: '4px 0 0 4px' }}
                                onChange={(e) => setNewRoomData({ ...newRoomData, maxMonthly: e.target.value })}
                                value={newRoomData.maxMonthly}
                              />
                              <InputGroup.Text
                                style={{ borderRadius: '0 4px 4px 0' }}
                                id="basic-addon2">บาท/เดือน
                              </InputGroup.Text>
                            </InputGroup>
                          </Form.Group>
                        </Form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                          ปิด
                        </Button>
                        <Button variant="primary" onClick={handleSaveRoom}>
                          บันทึก
                        </Button>
                      </Modal.Footer>
                    </Modal>

                  </div>



                  <br /><br />

                  <Form.Label column sm={5} style={{ width: '20vh', fontWeight: 'normal', fontSize: '20px', color: '#666666' }}>
                    ค่าใช้จ่าย
                  </Form.Label>

                  <Form.Group as={Row} className="m-2" controlId="formHorizontalEmail">
                    <Form.Label column sm={5} style={{ width: '10vh', fontWeight: 'normal', color: '#666666' }}>
                      ค่าน้ำ
                    </Form.Label>
                    <InputGroup style={{ width: '30vh' }} className="mb-2">
                      <input
                        type='number'
                        id="billWater"
                        aria-describedby="basic-addon2"
                        className='form-control'
                        onChange={handleChange}
                        value={formData.billWater}
                      />
                      <InputGroup.Text id="basic-addon2">บาท/ยูนิต</InputGroup.Text>
                    </InputGroup>
                    <Form.Label column sm={5} style={{ width: '50vh' }}>
                      ตามยูนิตที่ใช้ หรือตามที่การประปากำหนด
                    </Form.Label>
                  </Form.Group>

                  <Form.Group as={Row} className="m-2" controlId="formHorizontalEmail">
                    <Form.Label column sm={5} style={{ width: '10vh', fontWeight: 'normal', color: '#666666' }}>
                      ค่าไฟ
                    </Form.Label>
                    <InputGroup style={{ width: '30vh' }} className="mb-2">
                      <input
                        type='number'
                        id="billElectrict"
                        aria-describedby="basic-addon2"
                        className='form-control'
                        onChange={handleChange}
                        value={formData.billElectrict}
                      />
                      <InputGroup.Text id="basic-addon2">บาท/ยูนิต</InputGroup.Text>
                    </InputGroup>
                    <Form.Label column sm={5} style={{ width: '50vh' }}>
                      ตามยูนิตที่ใช้ หรือตามที่การไฟฟ้ากำหนด
                    </Form.Label>
                  </Form.Group>

                  <hr style={{ marginTop: '20px', marginBottom: '20px', borderColor: '#D4D4D4' }} />

                  <Form.Group>
                    <Form.Label column sm={5} style={{ width: '30vh', fontWeight: 'normal', fontSize: '18px', color: '#666666' }}>
                      ค่าบริการส่วนอื่นๆ
                    </Form.Label>

                    <Form.Group as={Row} className="m-2" controlId="formHorizontalEmail">
                      <Form.Label column sm={5} style={{ width: '20vh', fontWeight: 'normal', color: '#666666' }}>
                        ค่ามัดจำ
                      </Form.Label>
                      <InputGroup style={{ width: '30vh' }} className="mb-2">
                        <input
                          type='number'
                          id="advance"
                          aria-describedby="basic-addon2"
                          className='form-control'
                          onChange={handleChange}
                          value={formData.advance}
                        />
                        <InputGroup.Text id="basic-addon2">บาท</InputGroup.Text>
                      </InputGroup>
                      <Form.Label column sm={5} style={{ width: '80vh', fontWeight: 'normal' }}>
                        หากท่านไม่ได้มาตามที่ตกลง ทางหอพักจะไม่คืนเงินในส่วนนี้
                      </Form.Label>
                    </Form.Group>

                    <Form.Group as={Row} className="m-2" controlId="formHorizontalEmail">
                      <Form.Label column sm={5} style={{ width: '20vh', fontWeight: 'normal', color: '#666666' }}>
                        ค่าประกัน
                      </Form.Label>
                      <InputGroup style={{ width: '30vh' }} className="mb-2">
                        <input
                          type='number'
                          id="insurance"
                          aria-describedby="basic-addon2"
                          className='form-control'
                          onChange={handleChange}
                          value={formData.insurance}
                        />
                        <InputGroup.Text id="basic-addon2">บาท/เดือน</InputGroup.Text>
                      </InputGroup>
                      <Form.Label column sm={5} style={{ width: '80vh', fontWeight: 'normal' }}>
                        หากท่านไม่ได้มาตามที่ตกลง ทางหอพักจะไม่คืนเงินในส่วนนี้
                      </Form.Label>
                    </Form.Group>

                    <Form.Group as={Row} className="m-2" controlId="formHorizontalEmail">
                      <Form.Label column sm={5} style={{ width: '20vh', fontWeight: 'normal', color: '#666666' }}>
                        ค่าส่วนกลาง
                      </Form.Label>
                      <InputGroup style={{ width: '30vh' }} className="mb-2">
                        <input
                          type='number'
                          id="service"
                          aria-describedby="basic-addon2"
                          className='form-control'
                          onChange={handleChange}
                          value={formData.service}
                        />
                        <InputGroup.Text id="basic-addon2">บาท/เดือน</InputGroup.Text>
                      </InputGroup>
                      <Form.Label column sm={5} style={{ width: '50vh', fontWeight: 'normal' }}>
                        เช่น ค่าส่วนกลาง 200 บาท/เดือน
                      </Form.Label>
                    </Form.Group>

                    <Form.Group as={Row} className="m-2" controlId="formHorizontalEmail">
                      <Form.Label column sm={5} style={{ width: '20vh', fontWeight: 'normal', color: '#666666' }}>
                        ค่าโทรศัพท์
                      </Form.Label>
                      <InputGroup style={{ width: '30vh' }} className="mb-2">
                        <input
                          type='number'
                          id="billTelephone"
                          aria-describedby="basic-addon2"
                          className='form-control'
                          onChange={handleChange}
                          value={formData.billTelephone}
                        />
                        <InputGroup.Text id="basic-addon2">บาท/เดือน</InputGroup.Text>
                      </InputGroup>
                      <Form.Label column sm={5} style={{ width: '80vh', fontWeight: 'normal' }}>
                        หากท่านไม่ได้มาตามที่ตกลง ทางหอพักจะไม่คืนเงินในส่วนนี้
                      </Form.Label>
                    </Form.Group>

                    <Form.Group as={Row} className="m-2" controlId="formHorizontalEmail">
                      <Form.Label column sm={5} style={{ width: '20vh', fontWeight: 'normal', color: '#666666' }}>
                        ค่าอินเทอร์เน็ต
                      </Form.Label>
                      <InputGroup style={{ width: '30vh' }} className="mb-2">
                        <input
                          type='number'
                          id="billInternet"
                          aria-describedby="basic-addon2"
                          className='form-control'
                          onChange={handleChange}
                          value={formData.billInternet}
                        />
                        <InputGroup.Text id="basic-addon2">บาท/เดือน</InputGroup.Text>
                      </InputGroup>
                      <Form.Label column sm={5} style={{ width: '80vh', fontWeight: 'normal' }}>
                        หากท่านไม่ได้มาตามที่ตกลง ทางหอพักจะไม่คืนเงินในส่วนนี้
                      </Form.Label>
                    </Form.Group>


                    < br />

                    <Form.Group className="">
                      <Form.Label column sm={5} style={{ width: '30%', fontWeight: 'normal', fontSize: '20px', color: '#666666' }}>
                        ภาพหอพัก
                      </Form.Label>
                      <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem' }}>
                        <div tabIndex="0">
                          <input
                            accept="image/jpeg,image/png"
                            multiple=""
                            type="file"
                            autoComplete="off"
                            tabIndex="-1"
                            style={{ display: 'none' }}
                          />
                          <div className="mb-2">
                            <div className="text-center">
                              <img src="https://bcdn.renthub.in.th/assets/renthub/empty-pictures-affed04adf0912d00564dc652267ca1e.svg" className="css-1u1zie3" alt="Empty Pictures" />
                            </div>
                          </div>
                          <span>ลากรูปภาพมาวางบริเวณนี้เพื่ออัพโหลด</span>
                        </div>
                        <p style={{ fontWeight: 'bold' }}>
                          ภาพหน้าปก:
                          <span className='p-2 font-normal text-gray-600 ml-2'>
                            ภาพห้องพักของท่าน (สูงสุด 6 ภาพ)
                          </span>
                        </p>
                        <div className='flex flex-col flex-1 gap-4'>
                          <div className='flex gap-4'>
                            <Form >
                              <input
                                className='p-3 border border-gray-300 rounded w-full'
                                type='file'
                                id='images'
                                accept='image/*'
                                multiple
                                onChange={(e) => setFiles(e.target.files)}
                              />
                              <button
                                type='button'
                                disabled={uploading}
                                className='btn btn-primary p-2 mx-2'
                                style={{ color: 'white' }}
                                onClick={handleImageSubmit}
                              >
                                {uploading ? 'กำลังอัพโหลด...' : 'อัพโหลด'}
                              </button>
                              <p style={{ color: 'red' }}>{imageUploadError && imageUploadError}</p>
                              {
                                formData.image.length > 0 && formData.image.map((url, index) => (
                                  <div
                                    key={url}
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                    className='p-3 border items-center'  >
                                    <img src={url} alt='listing image' className='object-cover rounded-lg' style={{ width: '15vh', height: '15vh' }} />
                                    <button
                                      type='button'
                                      onClick={() => handleRemoveImage(index)}
                                      className='rounded-lg uppercase hover:opacity-75'
                                      style={{ borderColor: 'red', borderStyle: 'solid', borderWidth: '1px', backgroundColor: 'transparent', color: 'red' }}>
                                      ลบรูปภาพ
                                    </button>
                                  </div>
                                ))
                              }
                            </Form>
                          </div>
                        </div>
                      </Card>
                    </Form.Group>
                    < br />
                    <Form.Label column sm={5} style={{ width: '30%', fontWeight: 'normal', fontSize: '20px', color: '#666666' }}>
                      รายละเอียดหอพัก
                    </Form.Label>
                    <Form.Group controlId="formBasicText">
                      <textarea
                        type='text'
                        placeholder='รายละเอียดหอพัก...'
                        className='border p-3 rounded-lg w-100 h-100'
                        id='description'
                        onChange={handleChange}
                        value={formData.description}
                      />
                    </Form.Group>
                  </Form.Group>
                  <br />

                  <Form.Label column sm={5} style={{ width: '30%', fontWeight: 'normal', fontSize: '20px', color: '#666666' }}>
                    ข้อตกลงในการลงประกาศ

                    <div style={{ fontSize: '16px', width: '145vh' }}>
                      <p>
                        ในการลงประกาศจองหอพักเว็บ Dormitory RMUTT คุณยืนยันว่าได้อ่านข้อตกลงพร้อมทั้งยอมรับและตกลงจะปฏิบัติตามข้อตกลงดังกล่าว
                        อย่างเคร่งครัด พร้อมทั้งคุณยอมรับให้ทีมงานลงประกาศตามที่คุณได้ลงรายละเอียดไว้ ณ ที่นี้
                      </p>
                    </div>
                  </Form.Label>
                  <br /><br />

                  <div className='d-flex justify-content-start'>

                    <button disabled={loading || uploading} className='btn btn-primary'>
                      {loading ? 'ลงประกาศหอพัก...' : 'ลงประกาศหอพัก'}
                    </button>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                  </div>

                </Form.Group>
              </Form.Group><br />
            </Row>
          </Form>
        </Card>
      </div>
    </div>
  )
}

