import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Board from "../components/Board";
import "../styles/CommonStyle.css";
import { Outlet } from "react-router-dom";
// import RegisterStudent from './RegisterStudent';

function Dashboard() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let isLoggedIn = localStorage.getItem("idToken");
    if (isLoggedIn) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <>
      {loggedIn ? (
        <div className="wrapper">
          <Sidebar />
          {/* <Board /> */}
          <Outlet />
        </div>
      ) : (
        <div>
          <p>Please Login first to access the Dashboard</p>
        </div>
      )}
    </>
  );
}

export default Dashboard;
