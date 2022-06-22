import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import sch from "../assets/sch.png";

import logout from "../assets/logout.png";
import { logSliceActions } from "../Redux/Actions";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  

  const logoutHandler = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logSliceActions.logout());
        localStorage.clear();
        navigate("/");
        
        Swal.fire("Logged Out Sucessfully");
      }
    });
  }

  return (
    <div>
      <input type="checkbox" className="openSidebarMenu" id="openSidebarMenu" />
      <label
        htmlFor="openSidebarMenu"
        className="sidebarIconToggle"
      ></label>{" "}
      <div id="sidebarMenu">
        <ul className="sidebarMenuInner">
          <li>
            <img src={sch} className="logo" />
          </li>{" "}
          <li>
            <Link to="/dashboard/board"> Dashboard </Link>{" "}
            <span> Admin Panel </span>{" "}
          </li>{" "}
          <li>
            <Link to="/dashboard/RegisterUser"> Register User </Link>{" "}
          </li>{" "}
          <li>
            <Link to="/dashboard/register-stud"> Register Student </Link>{" "}
          </li>
          <li>
            <Link to="/dashboard/Course"> Register Class </Link>{" "}
          </li>{" "}
          <li>
            <Link to="/dashboard/StudentList"> Student </Link>{" "}
          </li>{" "}
          <li>
            <Link to="/dashboard/FeeCollection"> Pay Fee </Link>{" "}
          </li>{" "}
          <li>
            <Link to="/dashboard/Transactions"> Transaction </Link>{" "}
          </li>{" "}
          <li>
          <img src={logout} className="logout" />
            <button className="log" onClick={logoutHandler}>
              LogOut{" "}
            </button>{" "}
          </li>{" "}
        </ul>{" "}
      </div>{" "}
      <div id="center" className="main center">
        {" "}
      </div>{" "}
    </div>
  );
}

export default Sidebar;
