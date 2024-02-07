import React, { useEffect, useState } from 'react';

import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from 'react-router-dom'
import Alert from 'react-bootstrap/Alert';
import Navbar from "../../components/navbar/Navbar";

import axios from 'axios';
import { app } from '../../firebase';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

import { useSelector } from 'react-redux';

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
    // typeRooms: '',
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
  })

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
      setImageUploadError('คุณสามารถอัปโหลดได้เพียง 6 ภาพต่อรายการ')
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

  const [typeRoom, setTypeRoom] = useState('')
  const [sizeRoom, setSizeRoom] = useState('')
  const [mindaily, setMinDaily] = useState('')
  const [maxdaily, setMaxDaily] = useState('')
  const [minmonthly, setMinMonthly] = useState('')
  const [maxmonthly, setMaxMonthly] = useState('')
  const [billWater, setBillWater] = useState('')
  const [setWater, setSetWater] = useState('')
  const [billElectricity, setBillElectricity] = useState('')
  const [insurance, setInsurance] = useState('')
  const [service, setService] = useState('')
  const [advance, setAdvance] = useState('')
  const [billtelephone, setBilltelephone] = useState('')
  const [billinternet, setBillinternet] = useState('')
  const [desc, setDesc] = useState('')
  const [img, setImg] = useState('')
  const [status, setStatus] = useState('')

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
      setError(false);
  
      // First request to '/dormitorys'
      const resDormitorys = await fetch('/dormitorys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
  
      const dormitoryData = await resDormitorys.json();
  
      setLoading(false);
  
      if (dormitoryData.success === false) {
        setError(dormitoryData.message);
        return;
      }
  
      // Second request to '/rooms'
      const resRooms = await fetch('/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
  
      const roomData = await resRooms.json();
  
      setLoading(false);
  
      if (roomData.success === false) {
        setError(roomData.message);
        return;
      }
  
      navigate(`/reserve/${dormitoryData._id}/${roomData._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  
  


  //Multi Checkbox
  const [selectedOptions, setSelectedOptions] = useState([]);

  //สิ่งอำนวยความสะดวก
  const options = [
    { id: 1, label: 'เครื่องปรับอากาศ' },
    { id: 2, label: 'เฟอร์นิเจอร์-ตู้-เตียง' },
    { id: 3, label: 'พัดลม' },
    { id: 4, label: 'TV' },
    { id: 5, label: 'โทรศัพท์สายตรง' },
    { id: 6, label: 'อินเทอร์เน็ตไร้สาย (WIFI)' },
    { id: 7, label: 'เคเบิลทีวี' },
    { id: 8, label: 'ลิฟต์' },
    { id: 9, label: 'คีย์การ์ด' },
    { id: 10, label: 'สแกนลายนิ้วมือ' },
    { id: 11, label: 'กล้องวงจรปิด' },
    { id: 12, label: 'รปภ.' },
    { id: 13, label: 'ที่จอดรถ' },
    { id: 14, label: 'ที่จอดรถมอเตอร์ไซต์' },
    { id: 15, label: 'สระว่ายน้ำ' },
    { id: 16, label: 'ฟิตเนส' },
    { id: 17, label: 'ร้านขายอาหาร' },
    { id: 18, label: 'ร้านค้า' },
    { id: 19, label: 'ร้านซัก-รีด' },
    { id: 20, label: 'ร้านทำผม-เสริมสวย' },
    { id: 21, label: 'อนุญาตให้เลี้ยงสัตว์' },
    { id: 22, label: 'อนุญาตให้สูบบุหรี่ในห้องพัก' },

    // Add more options as needed
  ];

  //Checkbox
  const handleCheckboxChange = (optionId) => {
    const isSelected = selectedOptions.includes(optionId);

    if (isSelected) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

  //Switch Free or Full
  const [state, setState] = useState({
    full: 0,
    free: 0,
  });

  //Alert
  const [tname, setTname] = useState('')
  const [ename, setEname] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [line, setLine] = useState('')
  const [no, setNo] = useState('')
  const [road, setRoad] = useState('')
  const [street, setStreet] = useState('')
  const [district, setDistrict] = useState('')
  const [subdistrict, setSubdistrict] = useState('')
  const [province, setProvince] = useState('')
  const [code, setCode] = useState('')
  const [descript, setDescript] = useState('')

  const [isValidTname, setIsValidTname] = useState(true);
  const [isValidEname, setIsValidEname] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [isValidLine, setIsValidLine] = useState(true);
  const [isValidNo, setIsValidNo] = useState(true);
  const [isValidStreet, setIsValidStreet] = useState(true);
  const [isValidRoad, setIsValidRoad] = useState(true);
  const [isValidDistrict, setIsValidDistrict] = useState(true);
  const [isValidSubdistrict, setIsValidSubdistrict] = useState(true);
  const [isValidProvince, setIsValidProvince] = useState(true);
  const [isValidCode, setIsValidCode] = useState(true);
  const [isValidDesript, setIsValidDescript] = useState(true);

  const [showAlert, setShowAlert] = useState(false);



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

              <Form.Group as={Row} className="mb-1" style={{ margin: '10px' }} controlId="formHorizontalEmail">
                <Form.Label column sm={5} style={{ width: '30vh', fontWeight: 'normal', fontSize: '20px', color: '#666666' }}>
                  ชื่อที่พัก
                </Form.Label>
                <Col sm={6} style={{ width: '50vh' }}>
                  <input
                    type="text"
                    placeholder="Name"
                    id="tname"
                    className={isValidEname ? 'form-control' : 'form-control is-invalid'}
                    required
                    onChange={handleChange}
                    value={formData.tname}
                  />

                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-1" style={{ margin: '10px' }} controlId="formHorizontalEmail">
                <Form.Label codvlumn sm={5} style={{ display: 'flex', width: '30vh', height: '', fontWeight: 'normal', fontSize: '20px', color: '#666666' }}>
                  ชื่อที่พัก (English)
                </Form.Label>
                <Col sm={6} style={{ width: '50vh' }}>
                  <input
                    type="text"
                    placeholder="Name"
                    id="ename"
                    className={isValidEname ? 'form-control' : 'form-control is-invalid'}
                    required
                    onChange={handleChange}
                    value={formData.ename}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-1" style={{ margin: '10px' }} controlId="formHorizontalEmail">
                <Form.Label column sm={5} style={{ display: 'flex', width: '30vh', fontWeight: 'normal', fontSize: '20px', color: '#666666' }}>
                  อีเมล์
                </Form.Label>
                <Col sm={6} style={{ width: '50vh' }}>
                  <input
                    type="text"
                    placeholder="Email"
                    id="email"
                    className={isValidEmail ? 'form-control' : 'form-control is-invalid'}
                    required
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
                    placeholder="Phone"
                    id="phone"
                    className={isValidPhone ? 'form-control' : 'form-control is-invalid'}
                    required
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
                    placeholder="Line"
                    id="line"
                    className={isValidLine ? 'form-control' : 'form-control is-invalid'}
                    required
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
                          placeholder="No."
                          id="no"
                          style={{ width: '20vh' }}
                          className={isValidNo ? 'form-control' : 'form-control is-invalid'}
                          required
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
                          placeholder="Road."
                          id="road"
                          style={{ width: '20vh' }}
                          className={isValidRoad ? 'form-control' : 'form-control is-invalid'}
                          required
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
                          placeholder="Street."
                          id="street"
                          style={{ width: '20vh' }}
                          className={isValidStreet ? 'form-control' : 'form-control is-invalid'}
                          required
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
                          placeholder="Sub-district."
                          id="subdistrict"
                          style={{ width: '20vh' }}
                          className={isValidSubdistrict ? 'form-control' : 'form-control is-invalid'}
                          required
                          onChange={handleChange}
                          value={formData.subdistrict}
                        />
                      </Form.Group>

                      <Form.Group as={Col} controlId="formGridProvince">
                        <Form.Label>อำเภอ/เขต</Form.Label>
                        <input
                          type="text"
                          placeholder="District."
                          id="district"
                          style={{ width: '20vh' }}
                          className={isValidDistrict ? 'form-control' : 'form-control is-invalid'}
                          required
                          onChange={handleChange}
                          value={formData.district}
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridZipcode">
                        <Form.Label>จังหวัด</Form.Label>
                        <input
                          type="text"
                          placeholder="Province."
                          id="province"
                          style={{ width: '20vh' }}
                          className={isValidProvince ? 'form-control' : 'form-control is-invalid'}
                          required
                          onChange={handleChange}
                          value={formData.province}
                        />
                      </Form.Group>
                      <Form.Group as={Col} controlId="formGridZipcode">
                        <Form.Label>รหัสไปรษณีย์</Form.Label>
                        <input
                          type="text"
                          placeholder="Postal code."
                          id="code"
                          style={{ width: '20vh' }}
                          className={isValidCode ? 'form-control' : 'form-control is-invalid'}
                          required
                          onChange={handleChange}
                          value={formData.code}
                        />
                      </Form.Group>
                    </Row>
                  </Form.Group>
                  < br /> < br />


                  <Form.Group>
                    <Form.Label column sm={3} style={{ width: '30vh', padding: '5px', fontWeight: 'normal', fontSize: '20px', color: '#666666' }}>
                      สิ่งอำนวยความสะดวก
                    </Form.Label>
                    <Col xs="auto" className="my-1">
                      {options.map((option) => (
                        <Form.Check
                          key={option.id}
                          type="checkbox"
                          id={`checkbox-${option.id}`}
                          label={option.label}
                          checked={selectedOptions.includes(option.id)}
                          onChange={() => handleCheckboxChange(option.id)}
                        />
                      ))}
                    </Col>
                  </Form.Group>
                  < br />

                  <Form.Label column sm={5} style={{ width: '20vh', fontWeight: 'normal', fontSize: '20px', color: '#666666' }}>
                    ประเภทห้องพัก
                  </Form.Label>

                  <table size="m">
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
                          <select
                            aria-label="Default select example"
                            id="typeRooms"
                            required
                            // onChange={handleChange}
                            // className="form-control"
                          >
                            <option value="">เลือกรูปแบบห้อง</option>
                            <option value="studio">สตูดิโอ</option>
                            <option value="1room">ห้อง 1 ห้องนอน</option>
                            <option value="2room">ห้อง 2 ห้องนอน</option>
                          </select>



                        </td>

                        <td>
                          <InputGroup style={{ width: '30vh' }} className="mb-2 p-3">
                            <input
                              type='text'
                              id="sizeRooms"
                              placeholder=""
                              aria-label=""
                              aria-describedby="basic-addon2"
                              className='form-control'
                              required
                              onChange={handleChange}
                              value={formData.sizeRooms}
                            />
                            <InputGroup.Text id="basic-addon2">ตร.ม</InputGroup.Text>
                          </InputGroup>
                        </td>

                        <td>
                          <InputGroup style={{ width: '30vh' }} className="mb-2 p-3">
                            <input
                              type='number'
                              id="minDaily"
                              placeholder="เริ่มต้น"
                              aria-label="เริ่มต้น"
                              aria-describedby="basic-addon2"
                              className='form-control'
                              required
                              onChange={handleChange}
                              value={formData.minDaily}
                            />
                            <InputGroup.Text id="basic-addon2">บาท/วัน</InputGroup.Text>
                          </InputGroup>
                        </td>

                        <td>
                          <InputGroup style={{ width: '30vh' }} className="mb-7 p-3">
                            <input
                              type='number'
                              id="minMonthly"
                              placeholder="เริ่มต้น"
                              aria-label="เริ่มต้น"
                              aria-describedby="basic-addon2"
                              className='form-control'
                              required
                              onChange={handleChange}
                              value={formData.minMonthly}
                            />
                            <InputGroup.Text id="basic-addon2">บาท/เดือน</InputGroup.Text>
                          </InputGroup>
                        </td>
                      </tr>

                      <tr>
                        <td colSpan="2"></td>

                        <td>
                          <InputGroup style={{ width: '30vh' }} className="mb-7 p-3">
                            <input
                              type='number'
                              id="maxDaily"
                              placeholder="สูงสุด"
                              aria-label="สูงสุด"
                              aria-describedby="basic-addon2"
                              className='form-control'
                              required
                              onChange={handleChange}
                              value={formData.maxDaily}
                            />
                            <InputGroup.Text id="basic-addon2">บาท/วัน</InputGroup.Text>
                          </InputGroup>
                        </td>

                        <td>
                          <InputGroup style={{ width: '30vh' }} className="mb-7 p-3">
                            <input
                              type='number'
                              id="maxMonthly"
                              placeholder="สูงสุด"
                              aria-label="สูงสุด"
                              aria-describedby="basic-addon2"
                              className='form-control'
                              required
                              onChange={handleChange}
                              value={formData.maxMonthly}
                            />
                            <InputGroup.Text id="basic-addon2">บาท/เดือน</InputGroup.Text>
                          </InputGroup>
                        </td>
                      </tr>

                      {/* Uncomment the following lines if needed */}
                      {/* <tr>
      <td colSpan="4">
        <FormControlLabel
          control={<Switch checked={state.full === 1} name="full" />}
          label="สถานะห้อง : ว่าง"
        />
      </td>
    </tr> */}
                    </tbody>
                  </table>



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
                        required
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
                        required
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
                        ค่าส่วนกลาง
                      </Form.Label>
                      <InputGroup style={{ width: '30vh' }} className="mb-2">
                        <input
                          type='number'
                          id="service"
                          aria-describedby="basic-addon2"
                          className='form-control'
                          required
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
                        ค่าประกัน
                      </Form.Label>
                      <InputGroup style={{ width: '30vh' }} className="mb-2">
                        <input
                          type='number'
                          id="insurance"
                          aria-describedby="basic-addon2"
                          className='form-control'
                          required
                          onChange={handleChange}
                          value={formData.insurance}
                        />
                        <InputGroup.Text id="basic-addon2">บาท/เดือน</InputGroup.Text>
                      </InputGroup>
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
                          required
                          onChange={handleChange}
                          value={formData.billTelephone}
                        />
                        <InputGroup.Text id="basic-addon2">บาท/เดือน</InputGroup.Text>
                      </InputGroup>
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
                          required
                          onChange={handleChange}
                          value={formData.billInternet}
                        />
                        <InputGroup.Text id="basic-addon2">บาท/เดือน</InputGroup.Text>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group as={Row} className="m-2" controlId="formHorizontalEmail">
                      <Form.Label column sm={5} style={{ width: '20vh', fontWeight: 'normal', color: '#666666' }}>
                        ค่าอื่นๆ
                      </Form.Label>
                      <InputGroup style={{ width: '30vh' }} className="mb-2">
                        <input
                          type='number'
                          id="advance"
                          aria-describedby="basic-addon2"
                          className='form-control'
                          required
                          onChange={handleChange}
                          value={formData.advance}
                        />
                        <InputGroup.Text id="basic-addon2">บาท/เดือน</InputGroup.Text>
                      </InputGroup>
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
                          <span>ลากรูปภาพมาวางบริเวณนี้เพื่ออัพโหลด หรือ</span>
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
                                {uploading ? 'Uploading...' : 'Upload'}
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
                                      Delete
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
                        required
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

