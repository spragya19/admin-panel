import React, { useState, useEffect } from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import "../styles/FeeCollection.css";
import { db } from "../firebase/firebaseConfig";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { addDoc } from "firebase/firestore";
import {
  doc,
  updateDoc,
  collection,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import Spinner from "./Spinner";
import { getFirestore, getDocs } from "firebase/firestore";
import firebase from "firebase/app";
import { toast } from "react-toastify";
import ReactToPdf from "react-to-pdf";



const FeeCollection = () => {
  const [flags, setFlags] = useState({
    studentDataReceived: false,
    classDataReceived: false,
    studentDetailsReceived: false,
    loading: false,
    isVerified: false,
    firstTimeFeePayment: false,
    monthlyDisabled: false,
    month: false,
  
  });

  
  

  const [selectedData, setSelectedData] = useState({
    selectedUsername: null,
    selectedClassCode: null,
    selectedClassName: null,
    selectedFeeType: null,
    month: null,
  });

  const [formData, setFormData] = useState({
    classData: [],
    studentData: [],
    studentDetails: {},
    selectedClassData: [],
    selectedStudentData: [],
    transactionData: [],
    transId: [],
    feeData: {
      monthlyfee: 0,
      admissionfee: false,
      pendingfee: 0,
    },
    month: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setFlags((oldData) => {
        return { ...oldData, loading: true };
      });
      let qry = null;
      let stuDB = collection(db, "student");
      let stuList = [];

      qry = query(stuDB);
      const stuSnap = await getDocs(qry);
      stuSnap.forEach((doc) => stuList.push(doc.data()));
      setFlags((oldData) => {
        return { ...oldData, studentDataReceived: true };
      });

      let classList = [];
      let classDB = collection(db, "classes");
      qry = query(classDB, orderBy("timestamp"));
      const classSnap = await getDocs(qry);
      classSnap.forEach((doc) => classList.push(doc.data()));

      setFlags((oldData) => {
        return { ...oldData, classDataReceived: true };
      });

      setFormData((oldData) => {
        return { ...oldData, classData: classList, studentData: stuList };
      });

      setFlags((oldData) => {
        return { ...oldData, loading: false };
      });
    })();
  }, []);

  const adddata = async (formData) => {
    try {
      await addDoc(collection(db, "transaction"), formData);

      const stuDB = collection(db, "student");
      const student = query(stuDB, where("userName", "==", formData.userName));
      const stuSnap = await getDocs(student);
      let stuId = null;
      stuSnap.forEach((doc) => (stuId = doc.id));

      const updateRef = doc(db, "student", stuId);

      if (formData.feeType == "monthlyfee") {
        await updateDoc(updateRef, {
          monthlyFeePaid: formData.feeAmount.toString(),
        });
      } else {
        await updateDoc(updateRef, {
          admissionFeePaid: formData.feeAmount.toString(),
        });
      }

      

      toast("Fee paid successfully!");
      navigate("/dashboard/Transactions");
    } catch (e) {
      console.error("Error adding Details:", e);
      toast("Some error occured!");
    }
  };

  const handleverify = async () => {
    setFlags((oldData) => {
      return { ...oldData, isVerified: true };
    });

    const txnQuery = collection(db, "transaction");
    const tx = query(
      txnQuery,
      where("userName", "==", formData.studentDetails.userName)
    );
    const txnSnap = await getDocs(tx);
    let userData = [];
    txnSnap.forEach((doc) => {
      userData.push( {transId: doc.id, ...doc.data() });
    });

    setFormData(oldData => {
      return {...oldData, transactionData: userData};
    })

    if (userData.length <= 0) {
      setFormData((oldData) => {
        return {
          ...oldData,
        
          feeData: {
            monthlyfee: 0,
            pendingfee: formData.selectedClassData[0].monthlyfee,
            admissionfee: false,
          },
        };
      });
      setFlags((oldData) => {
        return { ...oldData, firstTimeFeePayment: true, monthlyDisabled: true };
      });
      return;
    } else {
      setFlags((oldData) => {
        return { ...oldData, firstTimeFeePayment: false };
      });

      let monthlyfee = 0;
      let admissionfee = false;

      for (let i = 0; i < userData.length; i++) {
        if (userData[i].feeType === "monthlyfee") {
          monthlyfee += +userData[i].feeAmount;
        }
        if (userData[i].feeType === "admissionfee") {
          admissionfee = true;
        }
      }

      let pendingfee = formData.selectedClassData[0].monthlyfee - monthlyfee;

      if (pendingfee <= 0) {
        setFlags((oldData) => {
          return { ...oldData, monthlyDisabled: true };
        });
      }

      setFormData((oldData) => {
        return {
          ...oldData,
          feeData: {
            monthlyfee: formData.selectedClassData[0].monthlyfee,
            admissionfee: admissionfee,
            pendingfee: pendingfee,
          },
        };
      });
    }
  };

  const findUserHandler = async (userid) => {
    setFlags((oldData) => {
      return { ...oldData, loading: true, studentDetailsReceived: false };
    });

    const userQuery = collection(db, "users");
    const q = query(userQuery, where("userName", "==", userid));

    const querySnap = await getDocs(q);
    querySnap.forEach((doc) => {
      setFormData((oldData) => {
        return { ...oldData, studentDetails: doc.data() };
      });
    });

    let selectedClassData = formData.classData.filter(
      (data) => data.classcode == selectedData.selectedClassCode
    );
    setFormData((oldData) => {
      return { ...oldData, selectedClassData: selectedClassData };
    });

    setFlags((oldData) => {
      return {
        ...oldData,
        loading: false,
        studentDetailsReceived: true,
        isVerified: false,
      };
    });
  };

  const [txnData, setTxnData] = useState({
    userName:"",
    class: '',
    rollNumber:""
  });

  const ref = React.createRef();
  const options = {
    orientation: 'landscape',
};

  const handleTxnSubmit = async () => {
 
    setFlags((oldData) => {
      return { ...oldData, loading: true };
    });
    
    let stuData = null;
    if (selectedData.selectedFeeType == "monthlyfee") {
      stuData = {
        userName: formData.studentDetails.userName,
        name: formData.studentDetails.name,
        classcode: formData.selectedClassData[0].classcode,
        class: formData.selectedClassData[0].class,
        feeType: "monthlyfee",
        feeAmount: flags.monthlyDisabled ? true : +formData.feeData.pendingfee,
        timestamp: serverTimestamp(),
      };
    } else if (selectedData.selectedFeeType == "admissionfee") {
      stuData = {
        userName: formData.studentDetails.userName,
        name: formData.studentDetails.name,
        classcode: formData.selectedClassData[0].classcode,
        class: formData.selectedClassData[0].class,
        feeType: "admissionfee",
        feeAmount: formData.selectedClassData[0].admissionfee,
        timestamp: serverTimestamp(),
      };
    }
    await adddata(stuData);
    setFlags((oldData) => {
      return { ...oldData, loading: false };
    });
  };

  return (
    <>
      {flags.loading && <Spinner />}
      {!flags.loading && flags.classDataReceived && flags.studentDataReceived && (
        <Formik initialValues={formData}>
          <Form>
            <div className="student-form">
              <div className="container p-0 m-0 ">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="fixed-left"></div>
                  </div>
                  <div className="col-lg-9 ">
                    <div className="row mt-2 mx-2">
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
                            disabled={flags.isVerified}
                            value={selectedData.selectedClassCode}
                            onChange={(e) => {
                              let selectedClass = formData.classData.filter(
                                (x) => x.classcode == e.target.value
                              );
                              selectedClass = selectedClass[0].class;
                              setSelectedData((oldData) => {
                                return {
                                  ...oldData,
                                  selectedClassCode: e.target.value,
                                  selectedClassName: selectedClass,
                                };
                              });
                              let studentFilter = formData.studentData.filter(
                                (x) => x.Class == selectedClass
                              );
                              setFormData((oldData) => {
                                return {
                                  ...oldData,
                                  selectedStudentData: studentFilter,
                                };
                              });
                            }}
                          >
                            <option>Select Class</option>
                            {formData.classData?.map((data) => (
                              <option
                                key={data.classcode}
                                value={data.classcode}
                              >
                                {data.class}
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
                            name="name"
                            disabled={flags.isVerified}
                            value={selectedData.selectedUsername}
                            onChange={(e) => {
                              setSelectedData((oldData) => {
                                return {
                                  ...oldData,
                                  selectedUsername: e.target.value,
                                };
                              });
                              findUserHandler(e.target.value);
                            }}
                          >
                            <option>Select Name</option>

                            {formData.selectedStudentData?.map((data) => (
                              <option key={data.userName} value={data.userName}>
                                {data.name}
                              </option>
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

      {!flags.loading && (
        <div className="row w-100 pt-3 customtbl">
          {flags.classDataReceived &&
            flags.studentDataReceived &&
            flags.studentDetailsReceived && (
              <div>
                <div className="detail">
                  <h3>Student details</h3>

                  <div className="cstm-tbll my-4">
                    <div className="d-flex justify-content-between">
                      <div className="d-flex">
                        <p>User Name -</p>
                        <p className="deet">{formData.studentDetails?.name}</p>
                      </div>
                      <div className="d-flex">
                        <p>Class Code -</p>
                        <p className="deet">{selectedData.selectedClassCode}</p>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between">
                      <div className="d-flex">
                        <p>Email</p>
                        <p className="deet">{formData.studentDetails?.email}</p>
                      </div>
                      <div className="d-flex">
                        <p>Mobile No. - </p>
                        <p className="deet">
                          {formData.studentDetails?.MobileNumber}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="d-flex">
                        <p>Father Name - </p>
                        <p className="deet">
                          {formData.studentDetails?.Fathername}
                        </p>
                      </div>
                      <div className="d-flex">
                        <p>Mother Name - </p>
                        <p className="deet">
                          {formData.studentDetails?.Mothername}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-3 ">
                    {" "}
                    <button
                      className="btn btn-dark"
                      disabled={flags.isVerified}
                      onClick={handleverify}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>
      )}

      {!flags.loading && flags.isVerified ? (
        <div>
          <div className="row w-100 pt-6 customtbl">
            <Formik initialValues={formData} onSubmit={handleTxnSubmit}  >
              <Form>
                <div className="transaction">
                  <div className="student-form">
                    <div className="container p-0 m-0 ">
                      <div className="row">
                        <div className="col-lg-3">
                          <div className="fixed-left"></div>
                        </div>
                        <div className="col-lg-9 txn">
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
                                  value={selectedData.selectedFeeType}
                                  onChange={(e) =>
                                    setSelectedData((oldData) => {
                                      return {
                                        ...oldData,
                                        selectedFeeType: e.target.value,
                                      };
                                    })
                                  }
                                >
                                  <option>Fee Type</option>
                                  <option
                                    value="admissionfee"
                                    disabled={formData.feeData.admissionfee}
                                  >
                                    Admission Fee
                                  </option>
                                  <option
                                    value="monthlyfee"
                                    disabled={flags.monthlyDisabled}
                                  >
                                    Monthly Fee
                                  </option>
                                </Field>
                              </div>
                            </div>

                            <div className="col-sm-6 xs-12  mt-3">
                              <div className="form-group">
                                <Field
                                  className="form-control"
                                  type="number"
                                  name="feeamt"
                                  value={
                                    selectedData.selectedFeeType == "monthlyfee"
                                      ? formData.feeData.pendingfee
                                      : selectedData.selectedFeeType ==
                                        "admissionfee"
                                      ? formData.selectedClassData[0]
                                          .admissionfee
                                      : ""
                                  }
                                  readonly={true}
                                  disabled={
                                    selectedData.selectedFeeType ==
                                    "admissionfee"
                                      ? true
                                      : false
                                  }
                                  onChange={(e) =>
                                    selectedData.selectedFeeType == "monthlyfee"
                                      ? setFormData((oldData) => {
                                          return {
                                            ...oldData,
                                            feeData: {
                                              pendingfee: e.target.value,
                                            },
                                          };
                                        })
                                      : null
                                  }
                              
                                ></Field>
                              </div>
                            </div>
                           

                            {!flags.firstTimeFeePayment && <div className="col-sm-6 xs-12  mt-3">
                              <div className="form-group">
                                <label htmlFor=""></label>
                                <Field
                                  className="form-control"
                                  type="text"
                                  name="month"
                                  as="select"
                                  placeholder="select Month"
                                >
                                  <option>Select Month</option>
                                  <option value="Jan">January</option>
                                  <option value="feb">February</option>
                                  <option value="march">March</option>
                                  <option value="april">April,</option>
                                  <option value="may">May</option>
                                  <option value="june">May</option>
                                  <option value="july">july</option>
                                  <option value="aug">August</option>
                                  <option value="sep">September</option>
                                  <option value="oct">October</option>
                                  <option value="nov">November</option>
                                  <option value="dec">December</option>
                                </Field>
                              </div>
                            </div>}
                            <div className="col-xs-12  mt-3">
                              <button
                                className="btn btn-dark text-center mb-4 mt-3 "
                                type="submit"
                                disabled={
                                  (selectedData.selectedFeeType ===
                                    "admissionfee" &&
                                    formData.feeData.admissionfee) ||
                                  (selectedData.selectedFeeType ===
                                    "monthlyfee" &&
                                  formData.feeData.monthlyfee == "true"
                                    ? true
                                    : false)
                                } 
                                onClick={handleTxnSubmit}
                            

                        
                              >
                                Mark as Paid
                              </button>
                            </div>
                              {formData.transactionData.length > 0 && <div className="detaill">
                                      <div className="cstm-tbll my-4" ref={ref}>
                                        <div className="mb-5">
                                          <h3>Transaction History -</h3>
                                        </div>
                                        <div className="ctm-row d-flex justify-content-between">
                                          <p className="fw-bold">Fee Type</p>
                                          <p className="fw-bold">Amount</p>
                                          <p className="fw-bold">Date</p>
                                        </div>
                                        {formData.transactionData?.map((x) => (
                                          <div className="ctm-row d-flex justify-content-between">
                                            <p>{x.feeType.toUpperCase()}</p>
                                            <p>{x.feeAmount}</p>
                                            <p>
                                              {new Date(
                                                x.timestamp.seconds * 1000
                                              ).toLocaleDateString()}
                                            </p>
                                          </div>
                                        ))}
                                    </div>
                                  </div>}

                          
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FeeCollection;
