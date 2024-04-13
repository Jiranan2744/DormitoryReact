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
        <br /><br />
        {/* <div className="headerSearch">
          <div className="headerSearchItem">
            <input type="text"
              placeholder="Search"
              className="headerSeachInput"
            />
          </div>

          <div className="headerSearchItem">
            <span className="headerSearchText"> date to date </span>
          </div>

          <div className="headerSearchItem">
            <span className="headerSearchText"> 1 room </span>

          </div>

          <div className="headerSearchItem">
            <button className="headerBtn">Search</button>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Header