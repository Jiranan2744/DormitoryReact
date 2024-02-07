import React, { useState, useEffect } from 'react'
import axios from "axios"

import Header from "../../components/header/Header"
import Navbar from "../../components/navbar/Navbar"
import "./home.css"
import Dormitory from '../../components/dormitorys/Dormitory'

function Home() {

  const [dormitorys, setDormitorys] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/dormitorys');
        setDormitorys(response.data);
      } catch (error) {
        console.error('Error fetching dormitories:', error);
      }
    };

    fetchData(); // Call the async function immediately

  }, []);

  return (
    <div>
      <Navbar />
      <Header />
      <br /> <br />
      <div className="dorm-card">
        <div className="card">
          <Dormitory />
        </div>

      </div>
    </div>
  );
};

export default Home