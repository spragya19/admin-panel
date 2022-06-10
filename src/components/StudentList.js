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

const StudentList = () => {
  const [dataShow, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ filterText: "" });

  const [order, setOrder] = useState("ASC");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  //delete
  const deletedata = async (id) => {
    deleteDoc(doc(db, "student", id));
    const oneIndex = dataShow.findIndex((val) => val.id === id);
    const cloned = [...dataShow];
    cloned.splice(oneIndex, 1);
    setData(cloned);
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

  ///sort

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...dataShow].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setData(sorted);
      setOrder("DSC");
    }
    if (order === "DSC") {
      const sorted = [...dataShow].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setData(sorted);
      setOrder("ASC");
    }
  };

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
                  <Row>
                    <Col className="col">
                      <h3 className="page-title">Students</h3>

                      <ul className="breadcrumb">
                        <li className="breadcrumb-item">Dashboard</li>
                      </ul>
                    </Col>
                  </Row>
                  <div class="input-group mb-2">
                    <div class="form-outline">
                      <input
                        type="search"
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                        class="form-control"
                        placeholder="search name"
                      />
                    </div>
                  </div>
                </div>
                <Table className="table table-hover">
                  <thead>
                    <tr>
                      <th onClick={() => sorting("rollNumber")} scope="col">
                        Roll No.
                      </th>
                      <th onClick={() => sorting("username")} scope="col">
                        Name
                        <BiSortAlt2 />
                      </th>
                      <th onClick={() => sorting("Class")} scope="col">
                        Class
                      </th>
                      <th scope="col">Fee Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataShow
                      .filter((val) => {
                        if (search === "") {
                          return val;
                        } else if (
                          val.username
                            .toLowerCase()
                            .includes(search.toLowerCase())
                        ) {
                          return val;
                        }
                      })
                      ?.map((list, index) => {
                        return (
                          <tr>
                            <td>{list?.rollNumber}</td>
                            <td>{list?.username}</td>

                            <td>
                              {list?.Class}
                              {"th"}
                            </td>
                            <td>pending</td>
                            <td>
                             
                              <button> <Link to ={`/dashboard/EditStudent/list.id}`} >{<MdEdit />}</Link></button>
                              {""} {""}
                              <button onClick={() => deletedata(list?.id)}>
                                {<MdDelete />}
                              </button>
                            </td>
                          </tr>
                          // </div>
                        );
                      })}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentList;
