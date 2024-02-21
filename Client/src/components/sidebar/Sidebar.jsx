
import './sidebar.css'
import React, { useState } from 'react';
import { Nav, Tab } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Sidebar = () => {

    const { currentUser } = useSelector((state) => state.user);

    const [showListingError, setShowListingError] = useState(false);
    const [userListings, setUserListings] = useState([]);

    const handleShowList = async () => {
        try {
            setShowListingError(false);
            const res = await fetch(`/users/listing/${currentUser._id}`);
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

    return (
        <div>
        <br />
        <Tab.Container defaultActiveKey="tab1">
            <Nav variant="tabs" style={{ marginLeft: '35vh', padding: '5px' }}>
                <Nav.Item>
                    <Nav.Link href='/'>
                        Home
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="tab1" onClick={handleShowList}>
                       ภาพรวมระบบ
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="tab2" onClick={handleShowList}>
                       ข้อมูลหอพัก
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="tab3" onClick={handleShowList}>
                       ข้อมูลผู้จอง
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Tab.Container>
        </div>
    );
};

export default Sidebar;
