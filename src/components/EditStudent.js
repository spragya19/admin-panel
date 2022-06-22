import { Field, Formik, Form, ErrorMessage } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/RegisterUser.css";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "./Spinner.js";
import { useParams } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";

const EditStudent = () => {
  const [dataReceived, setDataReceived] = useState(false);
  const [dataShow, setData] = useState([]);
  const { studentId } = useParams();
  const [details, setDetails] = useState({
    name: "",
    email: "",   
    password: "",
    MobileNumber: "",
    Fathername: "",
    Mothername: "",
    parentnumber: "",
    uid: "",
  });
 console.log(details)

  useEffect(() => {
  

    (async () => {
      const querySnapshot = await getDocs(collection(db, "student"));
      const list = [];
      querySnapshot.forEach((doc) => {
        if (doc.id === studentId) {
          list.push(doc.data());
        }
      });
      setDetails(list[0]);
      setDataReceived(true);
    })();
  }, [studentId]);

  const changeHandler = (e) => {
    setDetails((oldData) => {
      return { ...oldData, [e.target.name]: e.target.value };
      
    });
  };

  const handleSubmit = () => {
    console.log(details);
    // const updateRef = doc(db, "student",     );

    // console.log("Data submitted");
  };

  return (
    <>
      {dataReceived && details && (
        <Formik initialValues={details} onSubmit={handleSubmit}>
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
                          <h3 className="page-title">Edit Student</h3>
                        </div>
                      </div>

                      <div className="col-sm-6 xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor="">User Name</label>
                          <Field
                            className="form-control"
                            type="text"
                            name="name"
                            value={details.name}
                            onChange={changeHandler}
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
                            value={details.email}
                            onChange={changeHandler}
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
                            value={details.password}
                            onChange={changeHandler}
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
                            value={details.MobileNumber}
                            onChange={changeHandler}
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
                            value={details.Fathername}
                            onChange={changeHandler}
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
                            value={details.Mothername}
                            onChange={changeHandler}
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
                            value={details.parentnumber}
                            onChange={changeHandler}
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
                          Update
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

export default EditStudent;
