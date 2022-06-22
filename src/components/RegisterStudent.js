import { Field, Formik, Form, ErrorMessage } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/RegisterStudent.css";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import firebase from "firebase/compat/app";
import {
  collection,
  addDoc,
  getDocs,
  query,
  doc,
  serverTimestamp,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect } from "react";

const RegisterStudent = () => {
  const navigate = useNavigate();
  const [data, setdata] = useState({
    name: "",
    Class: "",
    rollNumber: "",
   

  });

  const [gotStudent, setGotStudent] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const adddata = async (data) => {
   
   
  console.log(data);
    await addDoc(collection(db, "student"), {
   
      name: data.name,
      Class: data.Class,
      rollNumber: data.rollNumber,
      userName: data.userName,
      monthlyFeePaid: "false",
      admissionFeePaid: "false",
    })
      .then((res) => {
        toast("Added Successfully!!");
        setLoading(false);
        navigate("/dashboard/StudentList");
      })
      .catch((err) => {
        console.log(err);
        toast("Some Error Occurred!!");
        setLoading(false);
      });
  };

  const [standard, setStandard] = useState([]);
  const [dataShow, setData] = useState([]);
  const [dataReceived, setDataReceived] = useState(false);
  const [users, setUsers] = useState([]);
  const [checkOptionValue, setCheckOptionValue] = useState(false);
  //class and student name dropdown

  useEffect(() => {
    (async () => {
      setLoading(true);
      let querys = collection(db, "users");
      let classquerys = collection(db, "classes");

      const Sort = query(classquerys, orderBy("timestamp", "asc"));
      const querySnap2 = await getDocs(Sort);

      const querySnapshot = await getDocs(querys);
      const q = await getDocs(classquerys);
      const list = [];
      const c = [];
      querySnapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id });
      });
      querySnap2.forEach((doc) => {
        c.push({ ...doc.data(), id: doc.id });
      });
      for (let i = 0; i < c.length; i++) {
        for (let j = i + 1; j < c.length; j++) {
          if (+c[i].class > +c[j].class) {
            let temp = c[i];
            c[i] = c[j];
            c[j] = temp;
          }
        }
      }
      setData(list);
      setStandard(c);
      setDataReceived(true);
      setLoading(false);
    })();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    let data = { ...details, Class: checkOptionValue };

    try {
      const { Class } = data;
      const { classcode } = data;
      const studentRef = collection(db, "student");

      const qroll = query(studentRef, where("Class", "==", Class));
      const querySnap = await getDocs(qroll);

      let roll = +parseInt(Class) * 1000 + querySnap.size + 1;

      const datacopy = { ...data };
      datacopy.rollNumber = roll;

      adddata(datacopy);
    } catch {
      console.log("err");
      setLoading(false);
    }
  };

  //detail show
  const classsHandler = async (e) => {
    if (e.target.value === "") {
      setCheckOptionValue(false);
    } else {
      setCheckOptionValue(e.target.value);
    }
  };

  const findUserHandler = async (e) => {
    setGotStudent(false);
    setDetails(null);
    const userQuery = collection(db, "users");
    const q = query(userQuery, where("name", "==", e.target.value));

    const querySnap = await getDocs(q);
    querySnap.forEach((doc) => {
      setDetails(doc.data());
    });
    setGotStudent(true);
  };

  return (
    <>
      {loading && <Spinner />}
      {!loading && dataReceived && (
        <Formik initialValues={data} onSubmit={handleSubmit}>
          <Form>
            <div className="student-form">
              <div className="container p-0 m-0 ">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="fixed-left"></div>
                  </div>
                  <div className="col-lg-9">
                    <div className="row mt-2 mx-2">
                      <div className="col-sm-12">
                        <div className="topmg">
                          <h3 className="page-title">Register Student</h3>
                        </div>
                      </div>

                      <div className="col-sm-6 xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor="">Class</label>
                          <Field
                            className="form-control"
                            as="select"
                            name="Class"
                            label="select"
                            value={data.Classess}
                            onChange={classsHandler}
                          >
                            <option value="">Select Class</option>
                            {standard.map((x) => (
                              <option key={x.classcode} value={x.class}>
                                {x.class}
                              </option>
                            ))}
                          </Field>
                        </div>
                      </div>

                      <div className="col-sm-6 xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor="">Student</label>

                          <Field
                            name="name"
                            as="select"
                            placeholder="select student"
                            className="form-control  "
                            value={users.name}
                            onChange={findUserHandler}
                          >
                            <option>Select Name</option>
                            {checkOptionValue &&
                              dataShow &&
                              dataShow.length > 0 &&
                              dataShow.map((x) => (
                                <option value={x.name}>{x.name}</option>
                              ))}
                          </Field>
                        </div>
                      </div>
                      <div className="col-sm-6 xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor="">Session</label>
                          <Field
                            className="form-control"
                            type="text"
                            name="session"
                            as="select"
                            label=" select session"
                            
                          >
                           
                            <option value="April, 2019 - March, 2020">
                              April, 2019 - March, 2020
                            </option>
                            <option value="April, 2020 - March, 2021">
                              April, 2020 - March, 2021
                            </option>
                            <option value="April, 2021 - March, 2022">
                              April, 2021 - March, 2022
                            </option>
                            <option value="April, 2022 - March, 2023">
                              April, 2022 - March, 2023
                            </option>
                            <option value="April, 2023 - March, 2024">
                              April, 2023 - March, 2024
                            </option>
                          </Field>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </Formik>
      )}
      <div className="row w-100 pt-3 customtbl">
        {!loading && dataReceived && details && (
          <div>
          <div className="detail">
            
            <h3>Student details</h3>

            <div className="cstm-tbll my-4">
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <p>User Name- </p>
                  <p className="deet">{details.name}</p>
                </div>
                <div className="d-flex">
                <div className="d-flex">
                  <p>Email- </p>
                  <p className="deet">{details?.email}</p>
                </div>
                </div>
              </div>

              <div className="d-flex justify-content-between">
              <div className="d-flex">
                  <p>Parent No. </p>
                  <p className="deet">{details?.parentnumber}</p>
                </div>
                
                <div className="d-flex">
                  <p>Mobile No.- </p>
                  <p className="deet">{details?.MobileNumber}</p>
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <p>Father Name- </p>
                  <p className="deet">{details?.Fathername}</p>
                </div>
                <div className="d-flex">
                  <p>Mother Name- </p>
                  <p className="deet">{details?.Mothername}</p>
                </div>
              </div>
            </div>
            </div>
            <div className="flex justify-center items-center mb-5">
              <button
                type="submit"
                className="btn btn-dark mt-3 ml-6"
                disabled={!gotStudent}
                onClick={handleSubmit}
              >
                Verify &amp; submit
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RegisterStudent;
