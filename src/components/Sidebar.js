import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import sch from "../assets/sch.png";

import logout from "../assets/logout.png";
import { logSliceActions } from "../Redux/Actions";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { BiHome } from "react-icons/bi";
import { AiOutlineUserAdd, AiOutlineFolderAdd } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { MdMoney } from "react-icons/md";
import { ErrorMessage } from "formik";
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
  };

  return (
 
      <div id="sidebarMenu"  >
        <ul className="sidebarMenuInner">
          <li>
            <img src={sch} className="logo" />
          </li>{" "}
          <li>
            <Link to="/dashboard/board">{<BiHome />} Dashboard </Link>{" "}
          </li>{" "}
          <li>
            <Link to="/dashboard/RegisterUser">
              {" "}
              {<AiOutlineUserAdd />} Register User{" "}
            </Link>{" "}
          </li>{" "}
          <li>
            <Link to="/dashboard/Course">
              {" "}
              {<AiOutlineFolderAdd />} Register Class{" "}
            </Link>{" "}
          </li>{" "}
          <li>
            <Link to="/dashboard/register-stud">
              {<BsPeople />} Register Student{" "}
            </Link>{" "}
          </li>{" "}
          {/* <li>
            <Link to="/dashboard/StudentList"> Student </Link>{" "}
          </li>{" "} */}
          <li>
            <Link to="/dashboard/FeeCollection">
              {" "}
              {<FaRegMoneyBillAlt />} Pay Fee{" "}
            </Link>{" "}
          </li>{" "}
          <li>
            <Link to="/dashboard/Transactions">
              {" "}
              {<MdMoney />} Transaction{" "}
            </Link>{" "}
          </li>{" "}
          <li>
            <img src={logout} className="logout" />
            <button className="log" onClick={logoutHandler}>
              LogOut{" "}
            </button>{" "}
          </li>{" "}
        </ul>{" "}
      </div>
    
  );
}

export default Sidebar;
