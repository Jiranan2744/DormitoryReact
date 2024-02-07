import { faEdit, faList, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';


export default function DashSidebar() {

    const location = useLocation();
    const [tab, setTab] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFormUrl = urlParams.get('tab');

        if (tabFormUrl) {
            setTab(tabFormUrl);
        }
    }, [location.search]);


    return (
        <Sidebar>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to="/dashboard?tab=dormitory list">
                        <Sidebar.Item
                            active={tab === 'profile'}>
                            <FontAwesomeIcon icon={faList} style={{ marginRight: '10px' }} />
                            รายการจองหอพัก
                        </Sidebar.Item>
                    </Link>

                    <Sidebar.Item active={tab === 'profile'}>
                        <FontAwesomeIcon icon={faList} style={{ marginRight: '10px' }} />
                        รายการลงประกาศหอพัก
                    </Sidebar.Item>

                    <Sidebar.Item>
                        <FontAwesomeIcon icon={faEdit} style={{ marginRight: '10px' }} />
                        เเก้ไขข้อมูลสมาชิก
                    </Sidebar.Item>

                    <Sidebar.Item>
                        <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '10px' }} />
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

