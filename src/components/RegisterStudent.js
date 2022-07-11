import { Field, Formik, Form, ErrorMessage } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/RegisterStudent.css";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import firebase from "firebase/compat/app";
import { useRef } from "react";
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
import { AiOutlineUnorderedList } from "react-icons/ai";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  ListItem,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";

const RegisterStudent = () => {
  const navigate = useNavigate();
  const [data, setdata] = useState({
    name: "",
    Class: "",
    rollNumber: "",
    session: "",
    timestamp: "",
  });

  const [gotStudent, setGotStudent] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState([]);

  const adddata = async (data) => {
  
    console.log(data);
    await addDoc(collection(db, "student"), {
      name: data.name,
      Class: data.Class,
      rollNumber: data.rollNumber,
      userName: data.userName,
      monthlyFeePaid: "false",
      admissionFeePaid: "false",
      timestamp: serverTimestamp(),
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

  useEffect(() => {
    console.log(">>>>>>useEffect1");
    (async () => {
      try {
        const q3 = await getDocs(collection(db, "student"));
        const add = [];
        q3.forEach((doc) => {
          return add.push({ ...doc.data(), id: doc.id });
        });

        setState(add);
      } catch (err) {
        console.log(">>>>Err", err);
      }
    })();
  }, []);

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
      //const q2 = query(useRef,
        // orderBy("name", "asc")
        // );
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
      toast.error("error");
      setLoading(false);
    }
  };
 
  //detail show
  const classsHandler = async (e) => {
    if (e.target.value === "") {
      setCheckOptionValue(false);
      setGotStudent(false);
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
                  <div className="col-lg-9">
                    <div className="row mt-2 mx-2">
                      <div className="col-sm-12">
                        <div className="topmg">
                          <h3 className="page-title">Register Student</h3>

                          <Link to={`/dashboard/StudentList`}>
                            <button type="button" className="btn btn-primary">
                              {" "}
                              {<AiOutlineUnorderedList />}List
                            </button>
                          </Link>
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
                                <option
                                  disabled={state.some(
                                    (item) => item.name == x.name
                                  )}
                                >
                                  {x.name}
                                </option>
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
      <div className="row w-100 pt-3 mt customtbl">
        {!loading && dataReceived && details && (
          <>
            <div className="reg-detail">
              <CardContent>
                <CardHeader title="Student Details" />
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12}>
                    <ListItem>
                      <ListItemText>First Name:-</ListItemText>
                      <ListItemText> {details.name} </ListItemText>
                    </ListItem>

                    <ListItem>
                      <ListItemText>Parent No.:-</ListItemText>
                      <ListItemText>{details?.parentnumber} </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>Mobile No.:- </ListItemText>
                      <ListItemText>{details?.MobileNumber} </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>Email:-</ListItemText>
                      <ListItemText> {details?.email} </ListItemText>
                    </ListItem>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <ListItem>
                      <ListItemText>Father's Name:-</ListItemText>
                      <ListItemText> {details?.Fathername} </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>Mother's Name:-</ListItemText>
                      <ListItemText>{details?.Mothername}</ListItemText>
                    </ListItem>
                  </Grid>
                </Grid>
              </CardContent>
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
          </>
        )}
      </div>
    </>
  );
};

export default RegisterStudent;
