import { Field, Formik, Form, ErrorMessage } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "../styles/RegisterUser.css";
import firebase from "firebase/compat/app";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { async } from "@firebase/util";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "./Spinner.js";

const RegisterUser = () => {
  const [dataShow, setShow] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setdata] = useState({
    role: "",
    username: "",
    email: "",
    password: "",
    MobileNumber: "",
    Fathername: "",
    Mothername: "",
    parentnumber: "",
    uid: "",
  });

  //authentication

  const Authentication = async (data) => {
    const authentication = getAuth();

    try {
     const userDetail =  await createUserWithEmailAndPassword(authentication, data.email, data.password);
      // console.log(user);
     const copy = {...data}
     copy.uid = userDetail.user.uid
     
     console.log(copy);
     addDoc(collection(db, 'users'), copy )
      toast("Registered Successfully!!")
     

    } catch (error) {
        console.log(error)
      toast("Some error occured!!")

    }


    // await createUserWithEmailAndPassword(authentication, data.email, data.password)
    //   .then((response) => {
    //     const userId = response.user.uid
    //     adddata( data, userId );
    //     console.log(response)
    //     console.log(response.user.uid)
    //     console.log(response.user)
    //     sessionStorage.setItem(
    //       "Auth Token",
    //       response._tokenResponse.refreshToken
    //     );
    //     return response.user.uid;
    //   })
    //   // .then((res) => adddata(data, res))
    //   .catch((err) => alert("error"));
  };

  ///firebase data store
  // const adddata = async (formData, uid) => {
  //   console.log(uid);
  //   console.log(formData);
  //   await addDoc(collection(db, "users"), {...formData})
  //     .then((res) => toast("Registered Successfully!!"))
  //     .catch((err) => {
  //       console.log("Error registering user - ", err);
  //       toast("Some Error Occurred!!");
  //     });
  // };

  const handleSubmit = (data) => {
    setLoading(true);
     Authentication(data);
    // await adddata(data);
    // console.log(data);
    setLoading(false);
    // navigate("/dashboard/register-stud");
  };

  const validate = Yup.object({
    role: Yup.string().required("Required"),
    username: Yup.string()
      .min(3, "Too Short")
      .max(10, "Too Long")
      .required("Required"),
    email: Yup.string()
      .email("Email is invalid")
      .required(" Email is Required"),

    password: Yup.string()
      .min(6, "password must be at least 6 char")
      .required("Required"),

    MobileNumber: Yup.number()
      .typeError("That doesn't look like a phone number")
      .positive("A phone number can't start with a minus")
      .integer("A phone number can't include a decimal point")
      .min(8)
      .required("Required"),
    Fathername: Yup.string()
      .min(3, "Too Short")
      .max(10, "Too Long")
      .required("Required"),
    Mothername: Yup.string()
      .min(3, "Too Short")
      .max(10, "Too Long")
      .required("Required"),
    parentnumber: Yup.number()
      .typeError("That doesn't look like a phone number")
      .positive("A phone number can't start with a minus")
      .integer("A phone number can't include a decimal point")
      .min(8)
      .required(" Required"),
      
  });

  return (
    <>
      {loading && <Spinner />}
      {!loading && (
        <Formik
          initialValues={data}
          onSubmit={handleSubmit}
          validationSchema={validate}
        >
          <Form>
            <div className="formm">
              <div className="container p-0 m-0 ">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="fixed-left"></div>
                  </div>
                  <div className="col-lg-9 ">
                    <div className="row mt-2">
                      <div className="col-sm-12">
                        <div className="topmg">
                          <h3 className="page-title">Add User</h3>
                        </div>
                      </div>

                      <div className="col-sm-6 xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor="">Roles</label>
                          <Field
                            className="form-control"
                            type="text"
                            name="role"
                            as="select"
                          >
                            <option>Roles</option>
                            <option>Admin</option>
                            <option>Staff</option>
                            <option>Student</option>
                          </Field>
                          <span className="text-danger">
                            <ErrorMessage name="role" />
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-6 xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor="">User Name</label>
                          <Field
                            className="form-control"
                            type="text"
                            name="username"
                          />
                          <span className="text-danger">
                            <ErrorMessage name="username" />
                          </span>
                        </div>
                      </div>

                      <div className="col-sm-6 xs-12 mt-3">
                        <div className="form-group">
                          <label htmlFor="">E-mail</label>
                          <Field
                            className="form-control"
                            type="email"
                            name="email"
                          />
                          <span className="text-danger">
                            <ErrorMessage name="email" />
                          </span>
                        </div>
                      </div>

                      <div className="col-sm-6 xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor="">Password</label>
                          <Field
                            className="form-control"
                            type="password"
                            name="password"
                          />
                          <span className="text-danger">
                            <ErrorMessage name="password" />
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-6 xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor="">Mobile Number</label>
                          <Field
                            className="form-control"
                            type="number"
                            name="MobileNumber"
                          />
                          <span className="text-danger">
                            <ErrorMessage name="MobileNumber" />
                          </span>
                        </div>
                      </div>

                      <div className="col-xs-12  mt-3">
                        <h5 className="form-title">
                          <span>Parent Information</span>
                        </h5>
                      </div>
                      <div className="col-sm-6 col-xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor="">FatherName</label>
                          <Field
                            className="form-control"
                            type="text"
                            name="Fathername"
                          />
                          <span className="text-danger">
                            <ErrorMessage name="Fathername" />
                          </span>
                        </div>
                      </div>

                      <div className="col-sm-6 col-xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor="">Mother Name</label>
                          <Field
                            className="form-control"
                            type="text"
                            name="Mothername"
                          />
                          <span className="text-danger">
                            <ErrorMessage name="Mothername" />
                          </span>
                        </div>
                      </div>

                      <div className="col-sm-6 col-xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor="">Parent Number</label>
                          <Field
                            className="form-control"
                            type="number"
                            name="parentnumber"
                          />
                          <span className="text-danger">
                            <ErrorMessage name="parentnumber" />
                          </span>
                        </div>
                      </div>

                      <div className="col-xs-12  mt-3">
                        <button
                          className="btn btn-dark text-center mb-4 mt-3 "
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </Formik>
      )}
    </>
  );
};

export default RegisterUser;
