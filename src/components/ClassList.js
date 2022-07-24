import React, { useEffect, useState } from "react";
import "../styles/ClassList.css";
import { Row, Col, Card, Form, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, query, where } from "firebase/firestore";
import Spinner from "./Spinner";
import DataTable from "react-data-table-component";
import { MdDelete, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import { CSVLink, CSVDownload } from "react-csv";
import { paths } from "../Routing/paths";
import { AiOutlineDownload } from "react-icons/ai";

const ClassList = () => {
  const [dataShow, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const actionEdit = async (id) => {
    try {
      const netEditElement = dataShow.find((elemnt) => elemnt.id === id);
      navigate(paths.getCourseEdit(id), { state: netEditElement });
    } catch (err) {
      alert(err);
    }
  };

  const headers = [
    { label: "Class", key: "class" },
    { label: "Class Code", key: "classcode" },
    { label: "Monthly Fee", key: "monthlyfee" },
    { label: "Admission Fee", key: "admissionfee" },
  ];
  const actionDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((willDelete) => {
      if (willDelete) {
        deleteDoc(doc(db, "class", id));
        const oneIndex = dataShow.findIndex((val) => val.id === id);
        const cloned = [...dataShow];
        cloned.splice(oneIndex, 1);
        setData(cloned);
        setOpen(false);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

  useEffect(() => {
    (async () => {
      const querySnapshot = collection(db, "classes");
      const Sort = query(querySnapshot, orderBy("timestamp", "asc"));
      const querySnap2 = await getDocs(Sort);

      const list = [];
      querySnap2.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id });
      });
      setData(list);
      navigate("/dashboard/ClassList");
    })();
  }, []);
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const columns = [
    {
      name: "Class",
      selector: (row) => row.class,

      sortable: true,
    },

    {
      name: "Class Code",
      selector: (row) => row.classcode,

      sortable: true,
    },
    {
      name: "Monthly Fee",
      selector: (row) => "₹" + numberWithCommas(row.monthlyfee),
      sortable: true,
    },
    {
      name: "Admission Fee",
      selector: (row) => "₹" + numberWithCommas(row.admissionfee),
      sortable: true,
    },

    {
      name: "Actions",
      selector: (row) => (
        <div>
          <button>
            <Link to={`/dashboard/Editclass/${row.id}`}>{<MdEdit />}</Link>
          </button>{" "}
          <button onClick={() => actionDelete(row?.id)}>{<MdDelete />}</button>
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
              <div className="page-headers">
                <h3 className="title">Class</h3>
                <br></br>
                <Col className="col">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item"></li>
                  </ul>
                </Col>
                <CSVLink
                  data={dataShow}
                  className="text-dark mt-5  "
                  id="csv"
                  filename="classes.csv"
                  headers={headers}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    className="btn btn-primary btn-block "
                  >
                    {" "}
                    {<AiOutlineDownload />}
                    Export CSV{" "}
                  </Button>
                </CSVLink>{" "}
                <div className="input-group mb-2 ml-2">
                  <div className="form-outline"   >
                    <input
                    id="class-list"
                  
                      type="search"
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                      className="form-control mt-5"
                      placeholder="Search Class"
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
                    val.class.toLowerCase().includes(search.toLowerCase())
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
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

export default ClassList;
