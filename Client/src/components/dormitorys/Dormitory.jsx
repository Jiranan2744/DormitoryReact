import React from 'react';
import useFetch from '../../hooks/useFetch';
import { Link } from 'react-router-dom';

import './dormitory.css';

function Dormitory() {
  const { data, loading } = useFetch("http://localhost:8080/api/dormitorys");

  return (
    <div className="fp">
      {loading ? (
        "Loading"
      ) : (
        <>
          {data.map((item) => (
            <div className="fpItem" key={item._id}>
              <img
                src={item.image[0]}
                alt=""
                className="fpImg"
              />
              <span className="fpName">{item.tname} {item.ename}</span>
              <span className="fpCity">{item.no} {item.road} {item.district} {item.subdistrict} {item.province} {item.code}</span>
              <span className="fpPrice">ราคาเริ่มต้น ${item.minDaily} - {item.maxDaily} บาท/วัน</span>
              <span className="fpPrice">ราคาเริ่มต้น ${item.minMonthly} - {item.maxMonthly} บาท/เดือน</span>


              <Link to={`/booking/${item._id}`}>
                <button className='btn btn-success'> View Details </button>
              </Link>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Dormitory;
