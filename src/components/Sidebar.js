import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import sch from "../assets/sch.png";

import logout from "../assets/logout.png";
import { logSliceActions } from "../Redux/Actions";
import { useDispatch } from "react-redux";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logSliceActions.logout());
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <div className="header">
        <div className="logo-img">
          <img src={sch} className="logo" />
        </div>
      </div>

      <input type="checkbox" className="openSidebarMenu" id="openSidebarMenu" />
      <label htmlFor="openSidebarMenu" className="sidebarIconToggle">
        <div className="spinner diagonal part-1" />
        <div className="spinner horizontal" />
        <div className="spinner diagonal part-2" />
      </label>
      <div id="sidebarMenu">
        <ul className="sidebarMenuInner">
          <li>
            <Link to="/dashboard/board"> Dashboard</Link>
            <span>Admin Panel</span>
          </li>
          <li>
            <Link to="/dashboard/RegisterUser">Register User</Link>
          </li>
          <li>
            <Link to="/dashboard/register-stud">Register Student</Link>
          </li>

          <li>
            <Link to="/dashboard/Course">Register Class</Link>
          </li>
          <li>
            <Link to="/dashboard/StudentList">Student</Link>
          </li>
          <li>
            <Link to="/dashboard/FeeCollection">Transaction</Link>
          </li>
          <li>
            <button className="log" onClick={logoutHandler}>
              LogOut
            </button>
          </li>
        </ul>
      </div>
      <div id="center" className="main center"></div>
    </div>
  );
}

export default Sidebar;
