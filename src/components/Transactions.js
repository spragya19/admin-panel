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

import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { CSVLink, CSVDownload } from "react-csv";
import moment from "moment";
import Pdf from "./Pdf";


const Tranactions = () => {
  const [dataShow, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ filterText: "" });
  const [order, setOrder] = useState("ASC");
  const [search, setSearch] = useState("");
   const [flags, setFlags] = useState({
    studentDataReceived: false,
    classDataReceived: false,
    studentDetailsReceived: false,
    loading: false,
  });
  // const [startDate, endDate] = dateRange;
  // const [dateRange, setDateRange] = useState([null, null]);

  // const { filterByType } = filter;

  const navigate = useNavigate();

  console.log(dataShow, "ds");

  
  
  let [searchparam, setsearchparam] = useSearchParams();
  const [txnData, setTxnData] = useState({
    userName:"",
    class: '',
    rollNumber:"",
    transId: ""
  });

  const [transactionData, setTransactionData] = useState([]);

  const ref = React.createRef();
  const options = {
    orientation: 'landscape',
};

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

      const txnQuery = collection(db, "transaction");
    const txnSnap = await getDocs(txnQuery);
    let userData = [];
    txnSnap.forEach((doc) => {
      userData.push( {transId: doc.id, ...doc.data()} );
    });

    let unames = userData.map(x => x.userName);
    let uSet = new Set(unames);
    let uniqueUsernames = [...uSet];
    let feedata = [];
    for(let i in uniqueUsernames) {
      feedata.push({uName: uniqueUsernames[i], admissionfee: 0, monthlyfee: 0 });
    }
    for(let i = 0; i < userData.length; i++) {
      for(let j = 0; j < feedata.length; j++) {
        if(userData[i].userName == feedata[j].uName) {
          if(userData[i].feeType == "monthlyfee") {
            feedata[j].monthlyfee += +userData[i].feeAmount;
          }
          else if(userData[i].feeType == "admissionfee") {
            feedata[j].admissionfee += +userData[i].feeAmount;
          }
          break;
        }
      }
    }

    setTransactionData(feedata);
      // setLoading(false);
    })();
  }, [searchparam]);
 
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


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
      name: "Paid On",
      selector: (row) =>
        moment(row.timestamp).format(" MMMM-DD-YY"),

      reorder: false,
    },
    
    {
      name: "Admission Fee",
      selector: (row) => {
        let fee = transactionData.find(x => x.uName == row.userName);
        return fee ? "₹" + numberWithCommas(fee.admissionfee) : 0;
      },
      sortable: true,
    },

    {
      name: "Monthly Fee ",
      selector: (row) =>{
        let fee = transactionData.find(x => x.uName == row.userName);
        return fee ? "₹" + numberWithCommas(fee.monthlyfee) : 0;
      },
      sortable: true,
    },

    {
      name: "Fee Status",
      selector: (row) => (
        <div className={`common ${row.totalFee <= 0 ? "paid" : "pending"}  `}>
          {/* {row.totalFee <= 0 ? 'Paid' : 'Pending'} */}
          {(row.monthlyFeePaid == "true" || +row.monthlyFeePaid >= 0) &&
          (row.admissionFeePaid == "true" || +row.admissionFeePaid >= 0)
            ? "Paid"
            : row.monthlyFeePaid == "false" && row.admissionFeePaid == "false"
            ? "Unpaid"
            : "Partial"}
        </div>
      ),
    },
    {
      name: "Invoice",
      selector: (row) => (
        <Pdf row={row} />
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
                      <h3 className="page-title">Tranactions</h3>
                       <div className="col-span-2 relative">
         
        </div>
                     
                        <CSVLink data={dataShow} className="text-dark"  filename="Transaction.csv">
                        <Button className="btn btn-primary btn-block ">Export CSV</Button>{" "}
                        </CSVLink>
                      
                    </Col>
                    <Col className="col">
                      <ul className="breadcrumb">
                        <li className="breadcrumb-item"></li>
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

export default Tranactions;
