import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Dashboard from "../pages/Dashboard";

function Authentication() {
  const navigate = useNavigate();
  const loggedIn = useSelector((state) => state.logReducer.loggedIn);
  useEffect(() => {
    loggedIn ? navigate("/dashboard/board") : navigate("/login");
  }, []);
  return <></>;
}

export default Authentication;
