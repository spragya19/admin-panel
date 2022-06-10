import React from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import { useState } from "react";
import firebase from "firebase/compat/app";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { async } from "@firebase/util";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Course.css";
import { addMethod } from "yup";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import * as Yup from "yup";

const Course = () => {
  const [loading, setLoading] = useState(false);
  const [data, setdata] = useState({
    class: "",
    admissionfee: "",
    monthlyfee: "",
    classcode: "",
    session: "",
  });
  const navigate = useNavigate();

  //Data store firebase
  const adddata = async (formData) => {
    try {
      const docRef = await addDoc(collection(db, "classes"), formData);
      toast("Added Successfully!!");
      setLoading(false);
      console.log("Document bID", docRef.id);
    } catch (e) {
      console.error("Error adding Details:", e);
      toast("Some Error Occurred!!");
      setLoading(false);
    }
  };

  const handleSubmit = (data) => {
    adddata(data);
    console.log(data);
    setLoading(false);
    navigate("/dashboard/ClassList");
    
  };
  const validate = Yup.object({
    class: Yup.string().required("Required"),
    admissionfee:
      Yup.string()
      .required("Required"),
    monthlyfee:
      Yup.string()
      .required(" Required"),
    classcode: Yup.string()
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
          <div className="c-form">
            <div className="container p-0 m-0 ">
              <div className="row">
                <div className="col-lg-3">
                  <div className="fixed-left"></div>
                </div>
                <div className="col-lg-9 ">
                  <div className="row mt-2">
                    <div className="col-sm-12">
                      <div className="topmg">
                        <h3 className="page-title">Register Class</h3>
                        <ul className="breadcrumb">
                          <li className="breadcrumb-item">
                            {" "}
                            <Link to={`/dashboard/ClassList`}> List</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-sm-6 xs-12  mt-3">
                      <div className="form-group">
                        <label htmlFor="">Class</label>
                        <Field
                          className="form-control"
                          type="text"
                          name="class"
                        />
                         <span className="text-danger">
                          <ErrorMessage name="class" />
                          </span>
                      </div>
                    </div>

                    <div className="col-sm-6 xs-12 mt-3">
                      <div className="form-group">
                        <label htmlFor="">Class-code</label>
                        <Field
                          className="form-control"
                          type="text"
                          name="classcode"
                        />
                         <span className="text-danger">
                          <ErrorMessage name="classcode" />
                          </span>
                      </div>
                    </div>

                    <div className="col-sm-6 xs-12  mt-3">
                      <div className="form-group">
                        <label htmlFor="">Monthly Fee</label>
                        <Field
                          className="form-control"
                          type="number"
                          name="monthlyfee"
                        />
                         <span className="text-danger">
                          <ErrorMessage name="monthlyfee" />
                          </span>
                      </div>
                    </div>

                    <div className="col-sm-6 xs-12 mt-3">
                      <div className="form-group">
                        <label htmlFor="">Admission Fee</label>
                        <Field
                          className="form-control"
                          type="number"
                          name="admissionfee"
                        />
                         <span className="text-danger">
                          <ErrorMessage name="admissionfee" />
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

export default Course;
