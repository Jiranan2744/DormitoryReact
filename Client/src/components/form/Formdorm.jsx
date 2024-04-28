import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom'
import Navbar from "../../components/navbar/Navbar";
import Modal from 'react-bootstrap/Modal';
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
import { faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Formdorm() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [rooms, setRooms] = useState([]);

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
    billWater: '',
    billElectrict: '',
    insurance: '',
    advance: '',
    billInternet: '',
    billTelephone: '',
    service: '',
    facilities: [],
  });

  const [roomTypes, setRoomTypes] = useState([
    {
      typeRooms: '',
      sizeRooms: '',
      minDailys: '',
      maxDailys: '',
      minMonthlys: '',
      maxMonthlys: '',
    },
  ]);



  const handleInputChange = (index, field, value) => {
    setRoomTypes(prevRoomTypesList => {
      const updatedRoomTypesList = [...prevRoomTypesList];
      updatedRoomTypesList[index][field] = value;
      return updatedRoomTypesList;
    });
  };


  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const [showWarningTname, setShowWarningTname] = useState(false);
  const [showWarningPhone, setShowWarningPhone] = useState(false);
  const [showWarningNo, setShowWarningNo] = useState(false);
  const [showWarningSubdistrict, setShowWarningSubdistrict] = useState(false);
  const [showWarningDistrict, setShowWarningDistrict] = useState(false);
  const [showWarningProvince, setShowWarningProvince] = useState(false);
  const [showWarningCode, setShowWarningCode] = useState(false);
  const [showWarningAdvance, setShowWarningAdvance] = useState(false);
  const [showWarningTyperooms, setShowWarningTyperooms] = useState(false);
  const [showWarningSizerooms, setShowWarningSizerooms] = useState(false);


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });

    switch (id) {
      case 'tname':
        setShowWarningTname(value.trim() === '');
        break;
      case 'phone':
        setShowWarningPhone(value.trim() === '');
        break;
      case 'no':
        setShowWarningNo(value.trim() === '');
        break;
      case 'subdistrict':
        setShowWarningSubdistrict(value.trim() === '');
        break;
      case 'district':
        setShowWarningDistrict(value.trim() === '');
        break;
      case 'province':
        setShowWarningProvince(value.trim() === '');
        break;
      case 'code':
        setShowWarningCode(value.trim() === '');
        break;
      case 'advance':
        setShowWarningAdvance(value.trim() === '');
        break;

      case 'typerooms':
        setShowWarningTyperooms(value.trim() === '');
        break;
      case 'sizerooms':
        setShowWarningSizerooms(value.trim() === '');
        break;

      default:
        break;
    }
  };

  //เลือกประเภทห้อง
  const handleChangeType = (e) => {
    const selectedType = e.target.value;
    setFormData({
      ...formData,
      typeRooms: selectedType,
    });
  };


  const navigate = useNavigate();

  //CREATE DORMITORYS

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Extract selected facility IDs
      const selectedFacilities = selectedOptions.map((facilityId) => ({ _id: facilityId }));

      // Map room types data to match backend structure
      const roomTypesData = roomTypes.map(({ typeRooms, sizeRooms, minDailys, maxDailys, minMonthlys, maxMonthlys }) => ({
        typeRooms,
        sizeRooms,
        minDailys,
        maxDailys,
        minMonthlys,
        maxMonthlys,
      }));

      // Send POST request to backend API endpoint
      const res = await fetch('/dormitorys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
          facilities: selectedFacilities,
          roomTypes: roomTypesData,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message);
      } else {
        // Redirect to booking page with the created dormitory ID
        navigate(`/booking/${data._id}`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };


  //เพิ่มห้องพัก
  const [showModal, setShowModal] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    typeRooms: "",
    sizeRooms: "",
    minDailys: "",
    maxDailys: "",
    minMonthlys: "",
    maxMonthlys: "",
  });

  const currentUserDormitoryId = currentUser.dormitoryId;
  const [roomTypesList, setRoomTypesList] = useState([]);

  const handleSaveRoom = () => {
    try {
      // Update the UI with the entered room data
      setRooms([...rooms, newRoomData]);

      // Reset the form fields
      setNewRoomData({
        typeRooms: '',
        sizeRooms: '',
        minDailys: '',
        maxDailys: '',
        minMonthlys: '',
        maxMonthlys: '',
      });

      // Close the modal
      setShowModal(false);
    } catch (error) {
      console.error('Error saving room data:', error);
      // Handle error messages if needed
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


  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteRoom = (index) => {
    const updatedRooms = [...rooms];
    updatedRooms.splice(index, 1); // Remove the room at the specified index
    setRooms(updatedRooms);
  };


  const [selectedWaterOption, setSelectedWaterOption] = useState([]);
  const [selectedElectricityOption, setSelectedElectricityOption] = useState([]);

  // Separate change handlers for water and electricity bill checkboxes
  const handleWaterCheckboxChange = (option) => {
    setSelectedWaterOption((prevOptions) => {
      if (prevOptions.includes(option)) {
        // If the option is already selected, remove it
        return prevOptions.filter((item) => item !== option);
      } else {
        // If the option is not selected, add it
        return [...prevOptions, option];
      }
    });
  };

  const handleElectricityCheckboxChange = (option) => {
    setSelectedElectricityOption((prevOptions) => {
      if (prevOptions.includes(option)) {
        // If the option is already selected, remove it
        return prevOptions.filter((item) => item !== option);
      } else {
        // If the option is not selected, add it
        return [...prevOptions, option];
      }
    });
  };

  //เพิ่มห้องพัก
  const [showUI, setShowUI] = useState(false);

  const handleDeleteRow = () => {
    setShowUI(false); // Hide the card from the page
  };

  const handleAddCard = () => {
    // Create a new room type object with empty fields
    const newRoomType = {
      typeRooms: '',
      sizeRooms: '',
      minDailys: '',
      maxDailys: '',
      minMonthlys: '',
      maxMonthlys: '',
    };

    // Add the new room type object to the roomTypes state
    setRoomTypes(prevRoomTypes => [...prevRoomTypes, newRoomType]);
  };


  const handleDelete = (index) => {
    setRoomTypes((prevRoomTypes) => {
      const updatedRoomTypes = [...prevRoomTypes];
      updatedRoomTypes.splice(index, 1);
      return updatedRoomTypes;
    });
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
                  <div>
                    <input
                      type="text"
                      placeholder="ชื่อ (ภาษาไทย)"
                      id="tname"
                      className={`form-control ${showWarningTname ? 'border-danger' : ''}`}
                      onChange={handleChange}
                      value={formData.tname}
                      onBlur={() => setShowWarningTname(formData.tname.trim() === '')}
                      style={{ marginBottom: '10px' }}
                    />
                    {showWarningTname && <span style={{ color: 'red' }}>กรุณาระบุชื่อที่พัก</span>}
                  </div>
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
                  <div>
                    <input
                      type="text"
                      placeholder="เบอร์โทร"
                      id="phone"
                      className={`form-control ${showWarningPhone ? 'border-danger' : ''}`}
                      onChange={handleChange}
                      value={formData.phone}
                      onBlur={() => setShowWarningPhone(formData.phone.trim() === '')}
                      style={{ marginBottom: '10px' }}
                    />
                    {showWarningPhone && <span style={{ color: 'red' }}>กรุณาระบุชื่อที่พัก</span>}
                  </div>
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
                        <div>
                          <input
                            type="text"
                            placeholder="เลขที่."
                            id="no"
                            className={`form-control ${showWarningNo ? 'border-danger' : ''}`}
                            onChange={handleChange}
                            value={formData.no}
                            onBlur={() => setShowWarningNo(formData.no.trim() === '')}
                            style={{ marginBottom: '10px' }}
                          />
                          {showWarningNo && <span style={{ color: 'red' }}>กรุณาระบุชื่อที่พัก</span>}
                        </div>
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

                      <Form.Group as={Col} controlId="formGridSubdistrict">
                        <Form.Label>ตำบล/แขวง</Form.Label>
                        <div>
                          <input
                            type="text"
                            placeholder="ตำบล/แขวง."
                            id="subdistrict"
                            className={`form-control ${showWarningSubdistrict ? 'border-danger' : ''}`}
                            onChange={handleChange}
                            value={formData.subdistrict}
                            onBlur={() => setShowWarningSubdistrict(formData.subdistrict.trim() === '')}
                            style={{ marginBottom: '10px' }}
                          />
                          {showWarningSubdistrict && <span style={{ color: 'red' }}>กรุณาระบุชื่อที่พัก</span>}

                          {/* Repeat similar blocks for other input fields */}
                        </div>
                      </Form.Group>

                      <Form.Group as={Col} controlId="formGridDistrict">
                        <Form.Label>อำเภอ/เขต</Form.Label>
                        <div>
                          <input
                            type="text"
                            placeholder="อำเภอ/เขต."
                            id="district"
                            className={`form-control ${showWarningDistrict ? 'border-danger' : ''}`}
                            onChange={handleChange}
                            value={formData.district}
                            onBlur={() => setShowWarningDistrict(formData.district.trim() === '')}
                            style={{ marginBottom: '10px' }}
                          />
                          {showWarningDistrict && <span style={{ color: 'red' }}>กรุณาระบุชื่อที่พัก</span>}
                        </div>
                      </Form.Group>

                      <Form.Group as={Col} controlId="formGridProvince">
                        <Form.Label>จังหวัด</Form.Label>
                        <div>
                          <input
                            type="text"
                            placeholder="จังหวัด."
                            id="province"
                            className={`form-control ${showWarningProvince ? 'border-danger' : ''}`}
                            onChange={handleChange}
                            value={formData.province}
                            onBlur={() => setShowWarningProvince(formData.province.trim() === '')}
                            style={{ marginBottom: '10px' }}
                          />
                          {showWarningProvince && <span style={{ color: 'red' }}>กรุณาระบุชื่อที่พัก</span>}
                        </div>
                      </Form.Group>

                      <Form.Group as={Col} controlId="formGridCode">
                        <Form.Label>รหัสไปรษณีย์</Form.Label>
                        <div>
                          <input
                            type="text"
                            placeholder="รหัสไปรษณีย์."
                            id="code"
                            className={`form-control ${showWarningCode ? 'border-danger' : ''}`}
                            onChange={handleChange}
                            value={formData.code}
                            onBlur={() => setShowWarningCode(formData.code.trim() === '')}
                            style={{ marginBottom: '10px' }}
                          />
                          {showWarningCode && <span style={{ color: 'red' }}>กรุณาระบุชื่อที่พัก</span>}
                        </div>
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

                  <Card style={{ width: '100%', marginTop: '20px' }}>
                    <Card.Body>
                      <Form>
                        <table className="table table-bordered">
                          <thead className="thead-light">
                            <tr>
                              <th style={{ width: '15%', textAlign: 'center' }}>รูปแบบห้องพัก</th>
                              <th style={{ width: '14%', textAlign: 'center' }}>ขนาดห้องพัก</th>
                              <th style={{ width: '35%', textAlign: 'center' }}>ห้องพักรายวัน (บาท/วัน)</th>
                              <th style={{ width: '36%', textAlign: 'center' }}>ห้องพักรายเดือน (บาท/เดือน)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {roomTypes.map((roomType, index) => (
                              <tr key={index}>
                                <td>
                                  <div style={{ marginTop: '10px', width: 'px' }} className="outfit-type">ประเภท {index + 1}</div>
                                  <FormSelect
                                    id={`typeRooms-${index}`}
                                    className="form-select"
                                    style={{ width: '100%', marginTop: '10px' }}
                                    onChange={(e) => handleInputChange(index, 'typeRooms', e.target.value)}
                                    value={roomType.typeRooms}
                                  >
                                    <option value="เลือกห้องพัก">เลือกห้องพัก</option>
                                    <option value="สูท">ห้องสูท</option>
                                    <option value="สตูดิโอ">ห้องสตูดิโอ</option>
                                    <option value="1 ห้องนอน">1 ห้องนอน</option>
                                    <option value="2 ห้องนอน">2 ห้องนอน</option>
                                    <option value="3 ห้องนอน">3 ห้องนอน</option>
                                  </FormSelect>
                                  <div style={{ marginTop: '1vh' }}>
                                    {roomType.typeRooms === "เลือกห้องพัก" && (
                                      <span style={{ marginLeft: '1vh', color: 'red' }}>กรุณาเลือกห้องพัก</span>
                                    )}</div>
                                </td>

                                <td>
                                  <div style={{ marginTop: '6vh' }} className="input-group">
                                    <input
                                      type="text"
                                      id={`sizeRooms-${index}`}
                                      className={`form-control ${showWarningSizerooms ? 'border-danger' : ''}`}
                                      onChange={(e) => {
                                        handleInputChange(index, 'sizeRooms', e.target.value);
                                        setShowWarningSizerooms(e.target.value.trim() === '');
                                      }}
                                      value={roomType.sizeRooms}
                                      onBlur={() => setShowWarningSizerooms(roomType.sizeRooms.trim() === '')}
                                    />
                                    <InputGroup.Text>ตร.ม</InputGroup.Text>
                                  </div>
                                  {showWarningSizerooms && (
                                    <div style={{ marginLeft: '2vh', marginTop: '1vh', color: 'red' }}>
                                      ระบุขนาดห้อง
                                    </div>
                                  )}
                                </td>

                                <td>
                                  <div className="d-flex">
                                    <div style={{ marginTop: '6vh' }} className="input-group me-2">
                                      <input
                                        type="number"
                                        id={`minDailys-${index}`}
                                        placeholder="ราคาต่ำสุด"
                                        className="form-control"
                                        onChange={(e) => handleInputChange(index, 'minDailys', e.target.value)}
                                        value={roomType.minDailys || ''}
                                      />
                                      <InputGroup.Text>บาท</InputGroup.Text>
                                    </div>
                                    <div style={{ marginTop: '6vh' }} className="input-group">
                                      <input
                                        type="number"
                                        id={`maxDailys-${index}`}
                                        placeholder="ราคาสูงสุด"
                                        className="form-control"
                                        onChange={(e) => handleInputChange(index, 'maxDailys', e.target.value)}
                                        value={roomType.maxDailys || ''}
                                      />
                                      <InputGroup.Text>บาท</InputGroup.Text>
                                    </div>
                                  </div>
                                </td>

                                <td>
                                  <div className="d-flex">
                                    {index > 0 && ( 
                                      <td style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '45vh' }}>
                                          <FontAwesomeIcon
                                            icon={faTrash}
                                            size='sm'
                                            style={{ cursor: 'pointer', color: 'red' }}
                                            onClick={() => handleDelete(index)}
                                          />
                                        </div>
                                      </td>
                                    )}
                                    <div style={{ marginTop: '6vh' }} className="input-group me-2">
                                      <input
                                        type="number"
                                        id={`minMonthlys-${index}`}
                                        placeholder="ราคาต่ำสุด"
                                        className="form-control"
                                        onChange={(e) => handleInputChange(index, 'minMonthlys', e.target.value)}
                                        value={roomType.minMonthlys || ''}
                                      />
                                      <InputGroup.Text>บาท</InputGroup.Text>
                                    </div>
                                    <div style={{ marginTop: '6vh' }} className="input-group">
                                      <input
                                        type="number"
                                        id={`maxMonthlys-${index}`}
                                        placeholder="ราคาสูงสุด"
                                        className="form-control"
                                        onChange={(e) => handleInputChange(index, 'maxMonthlys', e.target.value)}
                                        value={roomType.maxMonthlys || ''}
                                      />
                                      <InputGroup.Text>บาท</InputGroup.Text>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Form>
                    </Card.Body>
                  </Card>


                  <br /><br />

                  <Button onClick={handleAddCard}>เพิ่มห้องพัก</Button>


                  <br />

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
                    <Form.Group controlId="unitUsageOrWaterSpecification">
                      <Col sm={7} className="text-right" style={{ marginLeft: '10vh', marginTop: '2vh' }}>
                        <Form.Check
                          type="checkbox"
                          label="ตามยูนิตที่ใช้ ราคาต่อยูนิตตามที่การประปากำหนด"
                          checked={selectedWaterOption.includes('unitUsage')}
                          onChange={() => handleWaterCheckboxChange('unitUsage')}
                        />
                      </Col>
                    </Form.Group>
                  </Form.Group>
                  <br />

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
                    <Form.Group controlId="unitUsageOrWaterSpecification">
                      <Col sm={7} className="text-right" style={{ marginLeft: '10vh', marginTop: '2vh' }}>
                        <Form.Check
                          type="checkbox"
                          label="ตามยูนิตที่ใช้ ราคาต่อยูนิตตามที่การไฟฟ้ากำหนด"
                          checked={selectedElectricityOption.includes('unitUsage')}
                          onChange={() => handleElectricityCheckboxChange('unitUsage')}
                        />
                      </Col>
                    </Form.Group>
                  </Form.Group>

                  <hr style={{ marginTop: '20px', marginBottom: '20px', borderColor: '#D4D4D4' }} />

                  <Form.Group>
                    <Form.Label column sm={5} style={{ width: '30vh', fontWeight: 'normal', fontSize: '18px', color: '#666666' }}>
                      ค่าบริการส่วนอื่นๆ
                    </Form.Label>

                    <Form.Group as={Row} className="m-2" controlId="formHorizontalAdvance" style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                        <Form.Label column sm={5} style={{ width: '18.5vh', fontWeight: 'normal', color: '#666666', marginRight: '10px' }}>
                          ค่ามัดจำ
                        </Form.Label>
                        <InputGroup style={{ width: '26.5vh', marginRight: '10px' }} className="mb-2">
                          <input
                            type='number'
                            id="advance"
                            aria-describedby="basic-addon2"
                            className={`form-control ${showWarningAdvance ? 'border-danger' : ''}`}
                            onChange={handleChange}
                            value={formData.advance}
                          />
                          <InputGroup.Text id="basic-addon2">บาท</InputGroup.Text>
                        </InputGroup>
                        <Form.Label column sm={5} style={{ width: '80vh', fontWeight: 'normal' }}>
                          ในกรณีที่ไม่ได้มาตามที่ตกลง ทางหอพักจะไม่คืนเงินในส่วนนี้
                        </Form.Label>
                      </div>
                      {showWarningAdvance && <span style={{ color: 'red', marginLeft: '20vh' }}>กรุณาระบุค่ามัดจำ</span>}
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
                        <InputGroup.Text id="basic-addon2">บาท</InputGroup.Text>
                      </InputGroup>
                      <Form.Label column sm={5} style={{ width: '80vh', fontWeight: 'normal', marginLeft: '-2vh' }}>
                        ในกรณีที่ยกเลิกสัญญาเช่าก่อนกำหนดจะไม่ได้รับค่าประกันความเสียหายคืน
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
                      <Form.Label column sm={5} style={{ width: '80vh', fontWeight: 'normal', marginLeft: '-2vh' }}>
                        เช่น ค่าฟิตเนส 200 บาท/เดือน
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
                      <Form.Label column sm={5} style={{ width: '80vh', fontWeight: 'normal', marginLeft: '-2vh' }}>
                        สำหรับหอพักที่มีบริการโทรศัพท์สายตรงเท่านั้น
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
                      <Form.Label column sm={5} style={{ width: '80vh', fontWeight: 'normal', marginLeft: '-2vh' }}>
                        สำหรับหอพักที่มีบริการอินเทอร์เน็ตไร้สายเท่านั้น
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
                                {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
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
                        ในการลงประกาศหอพักบนเว็บ Dormitory RMUTT คุณยินดีที่จะเผยเเพร่ข้อมูลดังกล่าว
                        พร้อมทั้งยอมรับให้ทีมงานลงประกาศตามที่คุณได้ลงรายละเอียดไว้ ณ ที่นี้ หากทีมงานพบการกระทำที่ไม่เหมาะสม ทางทีมงานจะลบประกาศหอพักของคุณโดยไม่เเจ้งให้ทราบล่วงหน้า
                      </p>
                    </div>
                  </Form.Label>
                  <br /><br />

                  <div className='d-flex justify-content-start'>
                    <button disabled={loading || uploading} className='btn btn-primary'>
                      {loading ? 'ลงประกาศหอพัก...' : 'ลงประกาศหอพัก'}
                    </button>
                  </div>
                  {error && <p style={{ color: 'red', marginTop: '1vh' }}> กรุณากรอกข้อมูลให้ครบถ้วน </p>}
                </Form.Group>
              </Form.Group><br />
            </Row>
          </Form>
        </Card>
      </div>
      <br />
    </div>
  )
}

