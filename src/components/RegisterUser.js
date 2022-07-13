import { Field, Formik, Form, ErrorMessage } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "../styles/RegisterUser.css";
import firebase from "firebase/compat/app";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import "react-phone-number-input/style.css";
import PhoneInput from 'react-phone-input-2'

import 'react-phone-input-2/lib/bootstrap.css'
import { db } from "../firebase/firebaseConfig";
import { async } from "@firebase/util";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "./Spinner.js";
const role = [
  { name: "Admin", value: "1" },
  { name: "Staff", value: "2" },
  { name: "Student", value: "3" },
];
const RegisterUser = () => {
  const [dataShow, setShow] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setdata] = useState({
    role: "",
    name: "",
    email: "",
    password: "",
    MobileNumber: "",
    Fathername: "",
    Mothername: "",
    parentnumber: "",
    uid: "",
    userName: "",
  });
  const [value, setValue] = useState({mob: "", parentMob: ""});
  const createUserName = async () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const q = query(collection(db, "users"), where("role", "==", "3"));
    const studentSnapshot = await getDocs(q);
    const studentsLength = String(studentSnapshot.size).padStart(2, 0);

    return "PR" + year + studentsLength;
  };

  //authentication

  const Authentication = async (data) => {
    const authentication = getAuth();

    try {
      const userDetail = await createUserWithEmailAndPassword(
        authentication,
        data.email,
        data.password
      );

      const copy = { ...data };
      copy.uid = userDetail.user.uid;
      data.userName = await createUserName();
      copy.timestamp = serverTimestamp();

      console.log(data, "Datata");

      addDoc(collection(db, "users"), {
        role: data.role,
        userName: data.userName,
        name: data.name,
        email: data.email,
        password: data.password,
        MobileNumber: value.mob,
        uid: copy.uid,
        Fathername: data.Fathername,
        Mothername: data.Mothername,
        parentnumber: value.parentMob,
        timestamp: serverTimestamp()
      });
      toast("Registered Successfully!!");
    } catch (error) {
      console.log(error);
      toast("Some error occured!!");
    }
  };

  const handleSubmit = (data) => {
    setLoading(true);
    Authentication(data);

    setLoading(false);
    navigate("/dashboard/register-stud");
  };
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const validate = Yup.object({
    role: Yup.string().required("Required"),
    name: Yup.string()
      .min(3, "Too Short")
      .max(10, "Too Long")
      .required("Required"),
    email: Yup.string()
      .email("Email is invalid")
      .required(" Email is Required"),

    password: Yup.string()
      .min(6, "password must be at least 6 char")
      .required("Required"),

    // MobileNumber: Yup.string()
     
    //   .required("Required"),
    Fathername: Yup.string()
      .min(3, "Too Short")
      .max(10, "Too Long")
      .required("Required"),
    Mothername: Yup.string()
      .min(3, "Too Short")
      .max(10, "Too Long")
      .required("Required"),
    // parentnumber: Yup.string()
     
    //   .required(" Required"),
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
                            {role.map(({ name, value }) => (
                              <option key={value} value={value}>
                                {name}
                              </option>
                            ))}
                          </Field>
                          <span className="text-danger">
                            <ErrorMessage name="role" />
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-6 xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor=""> Name</label>
                          <Field
                            className="form-control"
                            type="text"
                            name="name"
                          />
                          <span className="text-danger">
                            <ErrorMessage name="name" />
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
                          <PhoneInput
                            placeholder="Enter phone number"
                            value={value.mob}
                            name="MobileNumber"
                            inputStyle={{ width: "100%", height: "40px" }}
                            onChange={(e) => setValue(oldData => {return {...oldData, mob: e}})}
                          />
                          <span className="text-danger">
                            <ErrorMessage name="MobileNumber" />
                          </span>
                        </div>
                      </div>
                      {/* <div className="col-sm-6 xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor="">Address</label>
                          <Field
                            className="form-control"
                            type="number"
                            name="Address"
                          />
                          <span className="text-danger">
                            <ErrorMessage name="MobileNumber" />
                          </span>
                        </div>
                      </div> */}

                      <div className="col-xs-12  mt-3">
                        <h5 className="form-title">
                          <span>Parent Information</span>
                        </h5>
                      </div>
                      <div className="col-sm-6 col-xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor="">Father Name</label>
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

                      <div className="col-sm-6 xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor="">Mobile Number</label>
                          <PhoneInput
                            placeholder="Enter phone number"
                            value={value.parentMob}
                            name="parentnumber"
                            inputStyle={{ width: "100%", height: "40px" }}
                            onChange={(e) => setValue(oldData => {return {...oldData, parentMob: e}})}
                          />
                          <span className="text-danger">
                            <ErrorMessage name="MobileNumber" />
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
