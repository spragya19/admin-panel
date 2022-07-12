import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Table } from "react-bootstrap";
import "../styles/StudentList.css";
import { doc, getDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  Badge,
  Box,


  CardContent,
  CircularProgress,
  Grid,
  IconButton,

  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import "../styles/Transactions.css";
import "bootstrap/dist/css/bootstrap.css";

import { Link, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import Spinner from "./Spinner";
import { Button, makeStyles } from "@material-ui/core";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { CSVLink, CSVDownload } from "react-csv";
import moment from "moment";
import { jsPDF } from "jspdf";
import { FaRegFilePdf } from "react-icons/fa";
import { AiOutlineDownload } from "react-icons/ai";

import "react-datepicker/dist/react-datepicker.css";
import { FcCalendar } from "react-icons/fc";
import { renderToString } from "react-dom/server";
import { faChampagneGlasses } from "@fortawesome/free-solid-svg-icons";
import Wid from "./Wid";
import Invoice from "./Invoice";
const useStyles = makeStyles(() => ({
  pdfbutton: {
    backgroundColor: "none",
    border: "none",
  },
}));
const Tranactions = () => {
  const [dataShow, setData] = useState([]);
  const [dropdown, setDropdown] = useState([]);
  const [standard, setStandard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ filterText: "" });
  const [order, setOrder] = useState("ASC");
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [FilteredData, setFilteredData] = useState([]);
  const [flags, setFlags] = useState({
    studentDataReceived: false,
    classDataReceived: false,
    studentDetailsReceived: false,
    loading: false,
  });
  console.log(FilteredData, "FilteredData");
  const classes = useStyles();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  console.log(dataShow, "ds");

  let [searchparam, setsearchparam] = useSearchParams();
  const [txnData, setTxnData] = useState({
    userName: "",
    class: "",
    rollNumber: "",
    transId: "",
  });

  const [transactionData, setTransactionData] = useState([]);

  const ref = React.createRef();
  const options = {
    orientation: "landscape",
  };

  const handleDownload = async (row, fee, time) => {
    const pdf = new jsPDF("p", "px", "a4");
    console.log(row, "roooooww");
    const classDb = collection(db, "classes");
    const qry = query(classDb, where("class", "==", row.Class));
    const stuSnap = await getDocs(qry);
    let totalFee = [];
    stuSnap.forEach((doc) => totalFee.push(doc.data()));
    let txnQuery = collection(db, "transaction");
    const tx = query(txnQuery, where("userName", "==", row.userName));
    const txnSnap = await getDocs(tx);
    let userData = [];
    txnSnap.forEach((doc) => {
      userData.push(doc.data());
    });
    console.log(userData, "udd");
    let monthlyFeePaid = 0;
    for (let i in userData) {
      if (userData[i].feeType == "monthlyfee") {
        monthlyFeePaid += userData[i].feeAmount;
      }
    }

    let pendingFees = +totalFee[0].monthlyfee - monthlyFeePaid;
    const html = renderToString(
      <Invoice row={row} fee={fee} time={time} pendingFees={pendingFees} />
    );
    pdf.html(html, {
      callback: function (pdf) {
        pdf.save("student.pdf");
      },
      html2canvas: { scale: 0.6 },
      
      x: 10,
      y: 20,
      windowWidth: 650,
      width: 190
    });
  };

  useEffect(() => {
    (async () => {
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
      const timestamp = serverTimestamp();
      orderBy("timeStamp", "desc");
      const txnSnap = await getDocs(txnQuery);
      let userData = [];
      txnSnap.forEach((doc) => {
        userData.push({ transId: doc.id, ...doc.data() });
      });

      let unames = userData.map((x) => x.userName);
      let uSet = new Set(unames);
      let uniqueUsernames = [...uSet];
      let feedata = [];
      for (let i in uniqueUsernames) {
        feedata.push({
          uName: uniqueUsernames[i],
          admissionfee: 0,
          monthlyfee: 0,
          lastTxnDate: null,
        });
      }
      for (let i = 0; i < userData.length; i++) {
        for (let j = 0; j < feedata.length; j++) {
          if (userData[i].userName == feedata[j].uName) {
            if (userData[i].feeType == "monthlyfee") {
              feedata[j].monthlyfee += +userData[i].feeAmount;
            } else if (userData[i].feeType == "admissionfee") {
              feedata[j].admissionfee += +userData[i].feeAmount;
            }
            feedata[j].lastTxnDate = userData[i].timestamp;
            break;
          }
        }
      }
      setTransactionData(feedata);
    })();
  }, [searchparam]);

  const hanldeDateChange = (startDate) => {
    if (!startDate) {
      setFilteredData(dataShow);
      return;
    }
    const dateValues = dataShow.filter((item) => {
      return (
        moment(item.timestamp.seconds * 1000).isSameOrAfter(
          moment(startDate[0]).startOf("day")
        ) &&
        moment(item.timestamp.seconds * 1000).isSameOrBefore(
          moment(startDate[1]).endOf("day")
        )
      );
    });
    setFilteredData(dateValues);
  };
  const styles = { width: 260 };
  useEffect(() => {
    (async () => {
      const querySnapshot = collection(db, "classes");
      const Sort = query(querySnapshot, orderBy("timestamp", "asc"));
      const querySnap2 = await getDocs(Sort);
      const list = [];
      querySnap2.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id });
      });
      console.log(list);
      setStandard(list);
    })();
  }, []);

  useEffect(() => {
    const Search = async () => {
      const param = searchparam.get("class");
      let querys = null;
      if (param) {
        querys = query(
          collection(db, "transaction"),
          where("class", "==", param)
        );
      } else {
        setLoading(true);
        querys = collection(db, "transaction");
      }
      const querySnapshot = await getDocs(querys);
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ ...doc.data(), id: doc.id });
        setLoading(false);
      });
      setDropdown(list);
    };

    Search();
  }, [searchparam]);
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const headers = [
    { label: "User Id", key: "userName" },
    { label: "Roll No", key: "rollNumber" },
    { label: "Name", key: "name" },
    { label: "Class", key: "Class" },
    { label: "Admission Fee", key: "admissionFeePaid" },
    { label: "Monthly Fee", key: "monthlyFeePaid" },
  ];

  console.log("dataShow");

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
      selector: (row) => {
        let time = transactionData.find((x) => x.uName == row.userName);
        time = time
          ? new Date(time.lastTxnDate.seconds * 1000).toLocaleDateString()
          : "Na";
        return time;
      },
    },
    {
      name: "Admission Fee",
      selector: (row) => {
        let fee = transactionData.find((x) => x.uName == row.userName);
        return fee ? "₹" + numberWithCommas(fee.admissionfee) : 0;
      },
      sortable: true,
    },

    {
      name: "Monthly Fee ",
      selector: (row) => {
        let fee = transactionData.find((x) => x.uName == row.userName);
        return fee ? "₹" + numberWithCommas(fee.monthlyfee) : 0;
      },
      sortable: true,
    },

    {
      name: "Fee Status",
      selector: (row) => (
        <div className={`common ${row.totalFee <= 0 ? "paid" : "pending"}  `}>
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

      selector: (row) => {
        let fee = transactionData.find((x) => x.uName == row.userName);
        let monthlyfee = fee ? numberWithCommas(fee.monthlyfee) : 0;
        let admissionfee = fee ? numberWithCommas(fee.admissionfee) : 0;
        let time = fee
          ? new Date(fee.lastTxnDate.seconds * 1000).toLocaleDateString()
          : "NA";
        return (
          <Button
            onClick={() => handleDownload(row, fee, time)}
            className={classes.pdfbutton}
          >
            <FaRegFilePdf
              style={{ color: "red", width: "20px", height: "20px" }}
            >
              {" "}
            </FaRegFilePdf>
          </Button>
        );
      },
    },
  ];

  const handleSearch = (e) => {
    setQ(e.target.value);
  };
  useEffect(() => {
    const value = dataShow.filter((item) =>
      item.name.toLowerCase().includes(q)
    );
    setFilteredData(value);
  }, [q, dataShow]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="tablee">
            <h3>Tranactions</h3>
            <Wid />


         
     
          <div className="container p-0 mt-5">
            <Row>
            
            
              <Col sm={12}>
                <div className="page-headers">
                  
                  <Row>
                    <div className="top ">
                      <div className="input-group mb-2 ">
                        <div className="form-outline  mr-sm-2 w-110">
                          <input
                            type="search"
                            id="search"
                            onChange={handleSearch}
                            className="form-control "
                            placeholder="Search Name"
                          />
                        </div>
                      </div>
                      <div className="input-group mb-2 ml-4">
                        <div className="form-outline">
                          <DateRangePicker
                            size="lg"
                            placeholder="Filter by Date"
                            style={styles}
                            onChange={hanldeDateChange}
                          />
                        </div>
                      </div>

                      <div className="dropdown ml-4  ">
                        <button
                          className="btn secondary  dropdown-toggle bg-black form-outline"
                          type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          Classes
                        </button>
                        <div
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <option value="">Select Class</option>
                          <li>
                            <Link
                              className="dropdown-item"
                              to={`/dashboard/Transactions`}
                            >
                              All
                            </Link>
                          </li>
                          {standard.map((i) => {
                            return (
                              <>
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/dashboard/Transactions?class=${i?.class}`}
                                  >
                                    {i.class}
                                  </Link>
                                </li>
                              </>
                            );
                          })}
                        </div>
                      </div>
                      <div className="input-group mb-2 ml-4">
                        <div>
                          <CSVLink
                            data={dataShow}
                            className="text-light"
                            filename="Transaction.csv"
                            headers={headers}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              className="btn btn-primary btn-block d-flex "
                            >
                              {<AiOutlineDownload />}
                              Export CSV
                            </Button>{" "}
                          </CSVLink>
                        </div>
                      </div>
                    </div>
                  </Row>
                </div>

                <DataTable
                  columns={columns}
                  data={FilteredData}
                  striped
                  highlightOnHover
                  Sorting
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
// width: 300px;
//     border: 1px solid #e5e5ea;
//     padding: 8px;




// puzzle curtain segment carbon frequent unlock below ski become taxi inhale bachelor