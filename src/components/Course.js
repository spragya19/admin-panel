import React from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import { useState } from "react";
import firebase from "firebase/compat/app";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { async } from "@firebase/util";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/Course.css";
import { addMethod } from "yup";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {AiOutlineUnorderedList} from "react-icons/ai"


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
  { name: "PR011", value: "PR011" },
  { name: "PR012", value: "PR012" },
];

const Course = () => {
const paarm=  useParams();
console.log(paarm)
  const [loading, setLoading] = useState(false);
  const [data, setdata] = useState({
    class: "",
    admissionfee: "",
    monthlyfee: "",
    classcode: "",
    timestamp: "",
  });
  const navigate = useNavigate();

  //Data store firebase
  const adddata = async (data) => {
    try {
      const docRef = await addDoc(collection(db, "classes"), {
        class: data.class,
        admissionfee: data.admissionfee,
        monthlyfee: data.monthlyfee,
        classcode: data.classcode,
        timestamp: serverTimestamp(),
      });
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
    admissionfee: Yup.string().required("Required"),
    monthlyfee: Yup.string().required(" Required"),
    classcode: Yup.string().required(" Required"),
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
                        
                              
                              {/* <Link to={`/dashboard/ClassList`}><button type="button" className="btn btn-primary">{<AiOutlineUnorderedList />}List</button></Link> */}
                            
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
                            as="select"
                            className="form-control"
                            type="text"
                            name="classcode"
                            placeholder="select"
                          >
                            {role.map(({ name, value }) => (
                              <option key={value} value={value}>
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
