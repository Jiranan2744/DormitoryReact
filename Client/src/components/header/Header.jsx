import "./header.css"
import { Link } from "react-router-dom";

function Header() {

  return (
    <div className="header">
      <div className="headerContainer">
        <h4 className="headerTitle"> รวมหอพัก ณ บริเวณมหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี</h4>
        <p className="headerDesc">
          Includes dormitories at Rajamangala University of Technology Thanyaburi.
        </p><br />
        <Link to="/formdorm" style={{ color: "inherit", textDecoration: "none" }}>
          <button className="headerButton">ลงทะเบียนหอพักฟรี</button>
        </Link>
      </div>
    </div>
  )
}

export default Header