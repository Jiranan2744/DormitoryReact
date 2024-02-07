
import "./navbar.css"
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { deleteUserFailure, deleteUserSuccess, signoutUserStart } from "../../redux/user/userSlice";


const Navbar = () => {

  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
        dispatch(signoutUserStart());
        const res = await fetch('/auth/signout');
        const data = await res.json();
        if (data.success === false) {
            dispatch(deleteUserFailure(data.message));
            return;
        }
        dispatch(deleteUserSuccess(data));
        navigate('/login'); 

    } catch (error) {
        dispatch(deleteUserFailure(error.message));
    }
};


  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
          <span className="logo" style={{ width: '50vh' }}>Dormitory RMUTT</span>
        </Link>

        <div className="container">
          <span className="context">ติดต่อเรา</span>
          {/* Your other content goes here */}
        </div>

        <div className="navItems">
          {currentUser ? (
            <Dropdown>
              <Dropdown.Toggle variant="" style={{ color: '#ffffff' }} id="dropdown-basic">
                {/* Display user's name in the dropdown toggle button */}
                {currentUser.firstname} {currentUser.lastname}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {/* Your dropdown content goes here */}
                <Dropdown.Item href="/reserve">
                  <FontAwesomeIcon icon={faList} style={{ marginRight: '5px' }} />
                  รายการจองหอพัก
                </Dropdown.Item>
                <Dropdown.Item href="/dashboard?tab=dormitory list">
                  <FontAwesomeIcon icon={faList} style={{ marginRight: '5px' }} />
                  รายการประกาศหอพัก
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/profile">
                  <FontAwesomeIcon icon={faEdit} style={{ marginRight: '5px' }} />
                  แก้ไขข้อมูลส่วนตัว
                </Dropdown.Item>
                <Dropdown.Item onClick={handleSignOut}>
                  <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '5px' }} />
                  ออกจากระบบ
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <>
              <div className="navItems">
                <Link to="/signup" className="navLink">
                  <button className="navButtonLogin">สมัครสมาชิก</button>
                </Link>

                <Link to="/login" className="navLink">
                  <button className="navButtonRegister">เข้าสู่ระบบ</button>
                </Link>
              </div>
            </>
          )}

        </div>

      </div >
    </div >
  );
}

export default Navbar


