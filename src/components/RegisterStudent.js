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
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect } from "react";

const RegisterStudent = () => {
  const navigate = useNavigate();
  const [data, setdata] = useState({
    username: "",
    Class: "",
    classcode: "",

  });

  const [gotStudent, setGotStudent] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const adddata = async (formData) => {
    formData.timeStamp = serverTimestamp();
    await addDoc(collection(db, "student"), formData)
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

      const querySnapshot = await getDocs(querys);
      const q = await getDocs(classquerys);
      const list = [];
      const c = [];
      querySnapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id });
      });
      q.forEach((doc) => {
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
    // adddata(data);
    // console.log(data);
    // navigate("/dashboard/StudentList");class
    try {
      const { Class } = data;
      const { classcode} =data;
      const studentRef = collection(db, "student");

      const qroll = query(studentRef, where("Class", "==", Class));
      const querySnap = await getDocs(qroll);

      // const croll = query(studentRef, where("Class", "==", classcode ))
      // const query = await getDocs(croll);

      let roll = +Class * 1000 + querySnap.size + 1;
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
    const q = query(userQuery, where("username", "==", e.target.value));

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
                  <div className="col-lg-9 ">
                    <div className="row mt-2">
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
                            name="username"
                            as="select"
                            placeholder="select student"
                            className="form-control  "
                            value={users.username}
                            onChange={findUserHandler}
                          >
                            <option>Select Name</option>
                            {checkOptionValue &&
                              dataShow &&
                              dataShow.length > 0 &&
                              dataShow.map((x) => (
                                <option value={x.username}>{x.username}</option>
                              ))}
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
            <h3>Student details</h3>

            <table className="cstm-tbl my-4">
              <tr>
                <td>User Name </td>
                <td>{details.username}</td>
              </tr>
              
              <tr className="flex">
                <td>Email </td>
                <td>{details.email}</td>
              </tr>
              <tr className="flex">
                <td>Mobile Number</td>
                <td>{details.MobileNumber}</td>
              </tr>
              <tr className="flex">
                <td>Father Name</td>
                <td>{details.Fathername}</td>
              </tr>
              <tr className="flex">
                <td>Mother Name</td>
                <td>{details.Mothername}</td>
              </tr>
              <tr className="flex">
                <td>Parent Number</td>
                <td>{details.parentnumber}</td>
              </tr>
            </table>
            <div className="flex justify-center items-center mb-5">
              <button
                type="submit"
                className="btn btn-dark"
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
