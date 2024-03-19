import React from 'react';
import useFetch from '../../hooks/useFetch';
import { Link } from 'react-router-dom';
import { Card, CardBody } from 'react-bootstrap'; // Import Card and CardBody from react-bootstrap

import './dormitory.css';

function Dormitory() {
  const { data, loading } = useFetch("/dormitorys");

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}> {/* Center content horizontally */}
      {loading ? (
        "Loading"
      ) : (
        <div style={{ width: '100%', maxWidth: '1024px' }}> {/* Limit width of content */}
          {data.map((item, index) => (
            <Card key={item._id}>
              <CardBody>
                <div className="dormitory-details">
                  <img
                    src={item.image[0]}
                    alt=""
                    className="fpImg"
                  />
                  <div style={{ marginLeft: '20px', flex: 1 }}>
                    <h4 className="fpName" style={{ marginBottom: '10px', marginTop: '0' }}>
                      <Link to={`/booking/${item._id}`} style={{ color: '#009FE3', fontWeight: 'bold', textDecoration: 'none' }}>{item.tname} {item.ename}</Link> {/* Apply styles inline */}
                    </h4>
                    <span className="fpCity" style={{ marginBottom: '5px' }}> {item.street} {item.district} {item.subdistrict} {item.province} {item.code}</span>

                    <div className="fpCity">
                      <span className="fpCity">
                        รายเดือน:&nbsp;
                        {item.minMonthly !== null && item.minMonthly !== undefined ? item.minMonthly : "โทรสอบถาม"}
                        {item.maxMonthly !== null && item.maxMonthly !== undefined ? ` - ${item.maxMonthly}` : ""}
                      </span>
                    </div>

                    <div>
                      <span className="fpCity">
                        วันที่ประกาศ: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
                      </span>
                    </div>
                    <br />
                    <div>
                      <Link to={`/booking/${item._id}`}>
                        <button className='btn btn-success'> รายละเอียด </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dormitory;
