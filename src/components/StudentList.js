import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button, Table } from "react-bootstrap";
import "../styles/StudentList.css";
import { doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, deleteDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import Spinner from "./Spinner";
import { BiSortAlt2 } from "react-icons/bi";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { CSVLink, CSVDownload } from "react-csv";
import {AiOutlineDownload} from "react-icons/ai"
const StudentList = () => {
  const [dataShow, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ filterText: "" });
  const [order, setOrder] = useState("ASC");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  console.log(dataShow, "ds");

  //delete
  const deletedata = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDoc(doc(db, "student", id));
        const oneIndex = dataShow.findIndex((val) => val.id === id);
        const cloned = [...dataShow];
        cloned.splice(oneIndex, 1);
        setData(cloned);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  let [searchparam, setsearchparam] = useSearchParams();

  //data show // student listing
  useEffect(() => {
    (async () => {
      // setLoading(true);

      const param = searchparam.get("class");
      let querys = null;
      if (param) {
        querys = query(collection(db, "student"), where("Class", "==", param));
      } else {
        querys = collection(db, "student");
      }

      const querySnapshot = await getDocs(querys);
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id });
      });

      setData(list);
      // setLoading(false);
    })();
  }, [searchparam]);
  const handleUserEdit = (row) => {
    navigate(`/dashboard/EditStudent/${row.id}`);
  };
  const headers = [
    { label: "User Id", key: "userName" },
    { label: "Name", key: "name" },
    { label: "Class", key: "Class" },
    { label: "Roll No", key: "rollNumber" },
  
  ];

  const columns = [
    {
      name: "User ID",
      selector: (row) => row.userName,

      sortable: true,
    },

    {
      name: "Roll Number",
      selector: (row) => row.rollNumber,

      sortable: true,
    },
    {
      name: "Full Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Class",
      selector: (row) => row.Class,
      sortable: true,
    },

    {
      name: "Action",
      button: true,
      selector: (row) => (
        <div>
          <button onClick={() => deletedata(row?.id)}>{<MdDelete />}</button>{" "}
        
        </div>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="tablee">
          <div className="container p-0 m-0">
            <Row>
              <Col lg={3}></Col>
              <Col sm={12}>
                <div className="page-headers">
                  <Row className="container">
                    <Col
                      xs={12}
                      className="d-flex align-items-center justify-content-between"
                    >
                      <h3 className="page-title">Student</h3>
                      <CSVLink
                        data={dataShow}
                        className="text-dark "
                        filename="Students.csv"
                        headers={headers}
                      >
                        <Button variant="contained" color="primary" className="btn btn-primary btn-block ">
                          {" "}
                          {<AiOutlineDownload />}
                          Export CSV
                        </Button>{" "}
                      </CSVLink>
                    </Col>
                    <Col className="col">
                      <ul className="breadcrumb">
                        <li className="breadcrumb-item"></li>
                      </ul>
                    </Col>
                  </Row>

                  <div className="input-group mb-2">
                    <div className="form-outline">
                      <input
                        type="search"
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                        className="form-control"
                        placeholder="Search Name"
                      />
                    </div>
                  </div>
                </div>
                <DataTable
                  columns={columns}
                  data={dataShow.filter((val) => {
                    if (search === "") {
                      return val;
                    } else if (
                      val.name.toLowerCase().includes(search.toLowerCase())
                    ) {
                      return val;
                    }
                  })}
                  striped
                  highlightOnHover
                  Sorting
                  defaultSortField="name"
                  pagination={1 - 5}
                ></DataTable>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentList;
