import React, { useState, useEffect } from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import "../styles/FeeCollection.css";
import { db } from "../firebase/firebaseConfig";
import { useLocation, useParams } from "react-router-dom";
import { addDoc } from "firebase/firestore";
import {
  doc,
  updateDoc,
  collection,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import Spinner from "./Spinner";
import { getFirestore, getDocs } from "firebase/firestore";
import firebase from "firebase/app";

const FeeCollection = () => {
  const [data, setdata] = useState({
    class: "",
    classcode: "",
  });

  const [classDetails, setClassDetails] = useState([]);

  const [gotStudent, setGotStudent] = useState(false);
  const [details, setDetails] = useState(null);
  const [dataShow, setData] = useState([]);
  const [dataReceived, setDataReceived] = useState(false);
  const [stu, setStu] = useState();
  const [loading, setLoading] = useState(false);
  const [standard, setStandard] = useState([]);
  const [transData, setTransData] = useState([]);
  const [verified, setVerified] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState();
  useEffect(() => {
    (async () => {
      const querySnapshot = await getDocs(collection(db, "classes"));
      const stuquery = await getDocs(collection(db, "student"));
      const stulist = [];
      const list = [];
      const c = [];
      querySnapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id });
      });
      stuquery.forEach((doc) => {
        stulist.push({ ...doc.data(), id: doc.id });
      });
      querySnapshot.forEach((doc) => {
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
      setStu(stulist);
      setStandard(c);
      setDataReceived(true);
      setVerified(true);
    })();
  }, []);

  const adddata = async (formData) => {
    try {
      const docRef = await addDoc(collection(db, "Transaction"), formData);
      console.log("Document bID", docRef.id);
    } catch (e) {
      console.error("Error adding Details:", e);
    }
  };

  const handleSubmit = (data) => {
    adddata(data);
    console.log(data);
  };
  const [selectstudent, setselectstudent] = useState();
  const [filterData, setfilterData] = useState();
  useEffect(() => {
    if (selectstudent) {
      setfilterData(stu.filter((val) => val.Class === selectstudent));
    } else {
      setfilterData(stu);
    }
  }, [selectstudent]);

  const findUserHandler = async (e) => {
    setGotStudent(false);
    setDetails(null);

    const userQuery = collection(db, "student");
    const q = query(userQuery, where("username", "==", e.target.value));

    const querySnap = await getDocs(q);
    querySnap.forEach((doc) => {
      setDetails(doc.data());
    });

    const classQuery = collection(db, "classes");
    const q2 = query(classQuery, where("classcode", "==", data.classcode));

    const querySnap2 = await getDocs(q2);
    let classDetail = [];
    querySnap2.forEach(doc => classDetail.push(doc.data()))
    console.log(classDetail[0]);
    setClassDetails(classDetail[0])
    setGotStudent(true);
  };

  // const handleSelect = (e) => {

  //   setTransData((prevState) => ({
  //     ...prevState,
  //     type: e.target.value,
  //   }));

  //   if (e.target.value === "admissionFee") {
  //     setTransData((prevState) => ({
  //       ...prevState,
  //       amount: data.admissionFee,
  //     }));
  //   } else if (e.target.value === "monthlyFee") {
  //     setTransData((prevState) => ({
  //       ...prevState,
  //       amount: data.monthlyFee,
  //     }));
  //   }
  // };

  return (
    <>
      {loading && <Spinner />}
      {dataReceived && (
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
                          <h3 className="page-title">Fee Transaction</h3>
                        </div>
                      </div>

                      <div className="col-sm-6 xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor="">Class</label>

                          <Field
                            name="class"
                            as="select"
                            placeholder="select student"
                            className="form-control"
                            value={dataShow.class}
                            onChange={(e) =>{
                              const idx = e.target.options.selectedIndex;
                  
                              setdata(olddata => {
                                return {...olddata, classcode:e.target.options[idx].getAttribute('class-code')}
                              })
                              return setselectstudent(e.target.value)
                            }
                            }
                          >
                            <option>Select Class</option>
                            {standard.map((x) => (
                              <option key={x.id} value={x.class} class-code={x.classcode}>
                                {x.class}
                                {"th standard"}
                              </option>
                            ))}
                          </Field>
                        </div>
                      </div>

                      <div className="col-sm-6 xs-12  mt-3">
                        <div className="form-group">
                          <label htmlFor="">Student</label>

                          <Field
                            className="form-control"
                            as="select"
                            name="username"
                            onChange={findUserHandler}
                            value={dataShow.username}
                          >
                            <option>Select Name</option>

                            {filterData?.map((x) => (
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
        {dataReceived && details && (
          <div>
            <h3>Student details</h3>

            <table className="cstm-tbl my-4">
              <tbody>
                <tr>
                  <td>User Name </td>
                  <td>{details.username}</td>
                </tr>
                <tr>
                  <td>Class Code </td>
                  <td>{data.classcode}</td>
                </tr>
                <tr>
                  <td>Roll No. </td>
                  <td>{details.rollNumber}</td>
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
              </tbody>
            </table>

            {/* <div className="text-center mt-3 ">
              {" "}
              <button className="btn btn-dark" disabled={!gotStudent}>
                Verify
              </button>
            </div> */}
          </div>
        )}
      </div>
      <div className="transaction">
        <div className="row w-100 pt-6 customtbl">
          {dataReceived && details && (
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
                              <h3 className="page-title">Transaction</h3>
                            </div>
                          </div>
                          <div className="col-sm-12"></div>

                          <div className="col-sm-6 xs-12  mt-3">
                            <div className="form-group">
                              <Field
                                name="fee"
                                as="select"
                                className="form-control"
                                placeholder="select Type"
                              >
                                <option>Fee Type</option>
                                <option value={data.admissionfee}>
                                  Admission Fee
                                </option>
                                <option value={data.monthlyfee}>
                                  Monthly Fee
                                </option>
                                <option>Pending Fee</option>
                              </Field>
                            </div>
                          </div>

                          <div className="col-sm-6 xs-12  mt-3">
                            <div className="form-group">
                              <Field
                                className="form-control"
                                type="number"
                                name="fee"
                              ></Field>
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
                          <div>
                            <ul>
                              <li>Admission Fee - {classDetails.admissionfee}</li>
                              <li>Monthly Fee - {classDetails.monthlyfee}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </Formik>
          )}
        </div>
      </div>
    </>
  );
};

export default FeeCollection;
