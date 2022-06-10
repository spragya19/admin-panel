import React, { useEffect, useState } from "react";
import "../styles/ClassList.css";
import { Row, Col, Card, Form, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import {  useNavigate } from "react-router-dom";


const ClassList = () => {
  const [dataShow, setData] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    (async () => {
      const querySnapshot = await getDocs(collection(db, "classes"));
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id });
      });
      setData(list);
      navigate("/dashboard/ClassList");
    })();
  }, []);
  return (
    <>
     
      <div className="Class-list">
        <div className="container">
          <Row>
            <Col lg={3}></Col>
            <Col sm={12}>
              <div className="page-header">
                <Row>
                  <Col className="col">
                    <h3 className="page-title">Courses</h3>
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item">Dashboard</li>
                      <li className="breadcrumb-item active">
                        <Link to={`/dashboard/Course`}>Add Class</Link>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </div>
              <Table className="table">
                <thead>
                  <tr>
                    <th scope="col">Class</th>
                    <th scope="col">Class Code</th>
                  
                    <th scope="col">Admission Fee</th>
                    <th scope="col">Monthly Fee</th>
                   
                  
                  </tr>
                </thead>
                <tbody>
                  {dataShow?.map((list, index) => {
                    return (
                      <tr>
                        <td>{list?.class}</td>
                        <td>{list?.classcode}</td>
                        <td>{list?.admissionfee}</td>
                        <td>{list?.monthlyfee}</td>
                        <td>
                        <button type="button" className="btn btn-success"> <Link to = {`/dashboard/StudentList?classId=${list.class}`}>View Student</Link></button>
                        </td>
                     
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default ClassList;
