import { Field, Formik, Form } from "formik";
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

function Login() {
  const authentication = getAuth();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
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

          navigate("/dashboard/board");
        } else {
          alert("Cannot send login request to database");
        }
      })
      .catch((err) => {
        console.log("Some Error Occured - ", err);
        alert("Wrong Credentials / User doesn't exist");
      });
  };
  return (
    <Formik initialValues={data} onSubmit={handleSubmit}>
      {() => (
        <section className="vh-100" style={{ backgroundColor: "#eee" }}>
          <div className="container h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-lg-12 col-xl-11">
                <div className="cardd text-black" style={{ borderRadius: 25 }}>
                  <div className="cardd-body p-md-5">
                    <div className="row justify-content-center">
                      <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                          Login
                        </p>
                        <Form className="mx-1 mx-md-4">
                          <div className="d-flex flex-row align-items-center mb-4"></div>
                          <div className="d-flex flex-row align-items-center mb-4">
                            <div className="form-outline flex-fill mb-0">
                              <Field
                                type="email"
                                id="form3Example3c"
                                className="form-control"
                                name="email"
                                placeholder="email"
                              />
                            </div>
                          </div>
                          <div className="d-flex flex-row align-items-center mb-4">
                            <div className="form-outline flex-fill mb-0">
                              <Field
                                type="password"
                                id="form3Example4c"
                                className="form-control"
                                placeholder="password"
                                name="password"
                              />
                            </div>
                          </div>
                          <div className="d-flex flex-row align-items-center mb-4"></div>
                          <div className="form-check d-flex justify-content-center mb-5">
                            <p className="forgot-password text-right">
                              Don't have an account{" "}
                              <Link to="/Signup">Signup</Link>
                            </p>
                          </div>
                          <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                            <button
                              type="submit"
                              className="btn btn-primary btn-lg"
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </Formik>
  );
}

export default Login;