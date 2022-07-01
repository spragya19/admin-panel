import React, { useEffect } from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import { useState } from "react";
import firebase from "firebase/compat/app";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { async } from "@firebase/util";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/Course.css";
import { addMethod } from "yup";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import * as Yup from "yup";

const role = [
  { name: "Select" },
  { name: "PR001", value: "PR001" },
  { name: "PR002", value: "PR002" },
  { name: "PR003", value: "PR003" },
  { name: "PR004", value: "PR004" },
  { name: "PR005", value: "PR005" },
  { name: "PR006", value: "PR006" },
  { name: "PR007", value: "PR007" },
  { name: "PR008", value: "PR008" },
  { name: "PR009", value: "PR009" },
  { name: "PR010", value: "PR010" },
];

const Editclass = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const handleChange = (name) => (event) => {
    //console.log(event.target.value);
    setData({ ...data, [name]: event.target.value });
  };

  const classref = doc(db, "classes", params.id);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const docSnap = await getDoc(classref);
        setData(docSnap.data());
      } catch (error) {
        console.log(error);
      }
    };
    console.log("update");
    fetchStudent();
  }, []);

  const handleSubmit = async () => {
    await updateDoc(doc(db, "classes", params.id), data);
    toast("Class Updated");
    console.log(data);
    setLoading(false);
    navigate("/dashboard/ClassList");
  };

  return (
    <>
      {loading && <Spinner />}
      {!loading && (
        <Formik initialValues={data} onSubmit={handleSubmit}>
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
                          <h3 className="page-title">Edit Class</h3>
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
                            value={data.class}
                            onChange={handleChange("class")}
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
                            as="select"
                            className="form-control"
                            name="classcode"
                            placeholder="select"
                            value={data.classcode}
                            onChange={handleChange("classcode")}
                          >
                            {role.map(({ name, value, index }) => (
                              <option key={index} value={value}>
                                {name}
                              </option>
                            ))}
                          </Field>
                          <span className="text-danger"></span>
                        </div>
                      </div>

                      <div className="col-sm-6 xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor="">Monthly Fee</label>
                          <Field
                            className="form-control"
                            type="number"
                            name="monthlyfee"
                            value={data.monthlyfee}
                            onChange={handleChange("monthlyfee")}
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
                            value={data.admissionfee}
                            onChange={handleChange("admissionfee")}
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

export default Editclass;
