import { Field, Formik, Form , ErrorMessage  } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import * as Yup from "yup";

import firebase from "firebase/compat/app";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { async } from "@firebase/util";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const Signup = () => {
    const [data, setdata] = useState({
       
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        uid: "",
      
      });
      const navigate = useNavigate();


      //authentication

  const Authentication = (data) => {
    const authentication = getAuth();
    {
      createUserWithEmailAndPassword(authentication, data.email, data.password)
        .then((response) => {
          navigate("/Login");
          sessionStorage.setItem(
            "Auth Token",
            response._tokenResponse.refreshToken
          );
          return response.user.uid;
        })
        .then((res) => adddata(data, res))
        .catch((err) => alert("User Already exists with same email!!"));
    }
  };

  ///firebase data store
  const adddata = async (formData, uid) => {
    try {
      await addDoc(collection(db, "admins"), {
        uid: uid,
        name: formData.name,
        
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.password,
        
      });
    } catch (e) {
      console.error("Error adding Details:", e);
    }
 
  };

 //validation
//  const validate = Yup.object({
//     name: Yup.string()
//       .min(3, "Too Short")
//       .max(10, "Too Long")
//       .required(" Name is Required"),
    
//     email: Yup.string()
//       .email("Email is invalid")
//       .required(" Email is Required"),
//     password: Yup.string()
//       .min(6, "password must be at least 6 char")
//       .required("Required"),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref("password"), null], "Password Must match ")
//       .required("Confirm password is required"),
//   });
  const handleSubmit = (data) => {
    
    Authentication(data);
    console.log(data);
  };

  return (
    <Formik initialValues={data} onSubmit={handleSubmit}   >
    {() => (
    <section className="vh-100" style={{ backgroundColor: "#eee" }}>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: 25 }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                      Sign up
                    </p>
                    <Form className="mx-1 mx-md-4">
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-user fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <Field
                            type="text"
                            id="form3Example1c"
                            className="form-control"
                            name="name"
                          />
                          <ErrorMessage name="name" />
                          <label
                            className="form-label"
                            htmlFor="form3Example1c"
                          >
                            Your Name
                          </label>
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-envelope fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <Field
                            type="email"
                            id="form3Example3c"
                            className="form-control"
                            name="email"
                          />
                          <ErrorMessage name="email" />
                          <label
                            className="form-label"
                            htmlFor="form3Example3c"
                          >
                            Your Email
                          </label>
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <Field
                            type="password"
                            id="form3Example4c"
                            className="form-control"
                            name="password"
                          />
                          <ErrorMessage name="password" />
                          <label
                            className="form-label"
                            htmlFor="form3Example4c"
                          >
                            Password
                          </label>
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-key fa-lg me-3 fa-fw" />
                        <div className="form-outline flex-fill mb-0">
                          <Field
                            type="password"
                            id="form3Example4cd"
                            className="form-control"
                            name="confirmpassword"
                          />
                          <ErrorMessage name="confirmpassword" />
                          <label
                            className="form-label"
                            htmlFor="form3Example4cd"
                          >
                            Repeat your password
                          </label>
                        </div>
                      </div>
                      <div className="form-check d-flex justify-content-center mb-5">
                        <p className="forgot-password text-right">
                          Already registered <Link to="/Login">Login</Link>
                        </p>
                      </div>
                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                        >
                          Register
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
    </Formik >
  )
}

export default Signup;
