import { Field, Formik, Form, ErrorMessage } from "formik";
import firebaseConfig from "../firebase/firebaseConfig";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { logSliceActions } from "../Redux/Actions";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { AiFillEye } from "react-icons/ai";
import "../styles/Login.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
const useStyles = makeStyles((theme) => ({
  backdrop: {
    color: "#fff",
    zIndex: theme.zIndex.drawer + 1,
  },
}));

function Login() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const authentication = getAuth();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    await signInWithEmailAndPassword(authentication, data.email, data.password)
      .then((data) => {
        if (data._tokenResponse.registered === true) {
          dispatch(logSliceActions.login());
          localStorage.setItem("localId", data._tokenResponse.localId);
          localStorage.setItem("idToken", data._tokenResponse.idToken);
          localStorage.setItem(
            "refreshToken",
            data._tokenResponse.refreshToken
          );
          toast("Logged in successfully!");
          navigate("/dashboard/board");
        } else {
          toast("Cannot send login request to database");
        }
      })
      .catch((err) => {
        console.log("Some Error Occured - ", err);
        toast("Wrong Credentials / User doesn't exist");
      });
  };

  const validate = Yup.object({
    email: Yup.string()
      .email("Email is invalid")
      .required(" Email is Required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 char")
      .required(" Password is Required"),
  });
  return (
    <Formik
      initialValues={data}
      onSubmit={handleSubmit}
      validationSchema={validate}
    >
      {() => (
        <div className="login">
          <section className="vh-100">
            <div className="container h-100">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-lg-12 col-xl-11">
                  <div
                    className="cardd text-black"
                    style={{ borderRadius: 25 }}
                  >
                    <div className="cardd-body p-md-5">
                      <div className="row justify-content-center">
                        <div
                          className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1"
                          id="login"
                        >
                          <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                            Login
                          </p>
                          <Form className="mx-1 mx-md-4">
                            <div className="d-flex align-items-end mb-4">
                              <div className="form-outline flex-fill mb-0">
                                <Field
                                  type="email"
                                  id="form3Example3c"
                                  className="form-control"
                                  name="email"
                                  placeholder="Enter Your Email"
                                />
                                <span className="text-danger">
                                  <ErrorMessage name="email" />
                                </span>
                              </div>
                            </div>
                            <div className="d-flex flex-row align-items-center mb-4">
                              <div className="form-outline flex-fill mb-0">
                                <Field
                                  id="form3Example4c"
                                  className="d-flex form-control"
                                  placeholder="Password"
                                  name="password"
                                  style={{ width: "85%", position: "absolute" }}
                                  type={passwordShown ? "text" : "password"}
                                ></Field>
                                <div
                                  className="d-flex justify-content-end ml-12   "
                                  style={{ width: "82%", position: "absolute" }}
                                >
                                  <AiFillEye
                                    className="d-flex justify-content-end mt-2 ml-5"
                                    onClick={togglePassword}
                                  />
                                </div>

                                <span className="text-danger">
                                  <ErrorMessage name="password" />
                                </span>
                              </div>
                            </div>

                            <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4 mt-4">
                              <button
                                type="submit"
                                className="btn btn-primary btn-lg mt-4"
                                onClick={() => {
                                  setOpen(!open);
                                }}
                              >
                                Login
                              </button>
                            </div>
                          </Form>
                        </div>
                        <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                            className="img-fluid"
                            alt="Sample image"
                          />
                        </div>
                        <Backdrop
                          className={classes.backdrop}
                          open={open}
                          onClick={() => {
                            setOpen(false);
                          }}
                        >
                          <CircularProgress color="inherit" />
                        </Backdrop>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </Formik>
  );
}

export default Login;
