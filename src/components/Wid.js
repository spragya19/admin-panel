import React from 'react'
import "../styles/Wid.css"
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import moment from "moment";
import Spinner from "./Spinner";

const Wid = () => {
    const [transactions, setTransactions] = useState([]);
  const [data, setData] = useState({
    noOfStudents: "Loading...",
    noOfUsers: "Loading...",
    todayTotal: "Loading...",
    weekTotal: "Loading...",
    monthlyTotal: "Loading...",
    loading: false,
  });

  const [transactionsTotal, setTransactionsTotal] = useState({});

  function dayDifference(time) {
    let todaysDate = Date.now();
    let difference =
      new Date(todaysDate).getTime() - new Date(time * 1000).getTime();
    let dayDifference = difference / (1000 * 60 * 60 * 24);
    return Math.round(dayDifference);
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setData((oldData) => {
          return { ...oldData, loading: true };
        });
        let stuCount = 0;
        const studentDB = collection(db, "student");
        const stuSnap = await getDocs(studentDB);
        stuSnap.forEach((doc) => ++stuCount);
        setData((oldData) => {
          return { ...oldData, noOfStudents: stuCount };
        });

        let userCount = 0;
        const userDB = collection(db, "users");
        const userSnap = await getDocs(userDB);
        userSnap.forEach((doc) => ++userCount);
        setData((oldData) => {
          return { ...oldData, noOfUsers: userCount };
        });

        let todaysTotal = 0;
        let weekTotal = 0;
        let monthlyTotal = 0;
        let txnData = [];
        const txnDB = collection(db, "transaction");
        const txnSnap = await getDocs(txnDB);
        txnSnap.forEach((doc) => txnData.push(doc.data()));
        for (let i in txnData) {
          if (dayDifference(txnData[i].timestamp.seconds) <= 1) {
            todaysTotal += +txnData[i].feeAmount;
          } else if (dayDifference(txnData[i].timestamp.seconds) <= 7) {
            weekTotal += +txnData[i].feeAmount;
          } else if (dayDifference(txnData[i].timestamp.seconds) <= 31) {
            monthlyTotal += +txnData[i].feeAmount;
          }
        }

        weekTotal = todaysTotal + weekTotal;
        monthlyTotal = weekTotal + monthlyTotal;

        setData((oldData) => {
          return {
            ...oldData,
            todayTotal: todaysTotal,
            weekTotal: weekTotal,
            monthlyTotal: monthlyTotal,
          };
        });
        setData((oldData) => {
          return { ...oldData, loading: false };
        });
      } catch (error) {
        console.log(error);
        setData((oldData) => {
          return { ...oldData, loading: false };
        });
      }
    };

    fetchTransactions();
  }, []);
  return (
   
    <div className="row mt-3">
    <div className="col-xl-3 mb-50 ">
      <div className="bg-white box-shadow border-radius-10 height-100-p widget-style1">
        <div className="d-flex flex-wrap align-items-center">
          <div className="circle-icon">
            <div className="icon border-radius-100 font-24 text-blue">
              <i className="fa fa-user" aria-hidden="true" />
            </div>
          </div>
          <div className="widget-data">
            <div className="weight-800 font-18">₹{data.todayTotal}</div>
            <div className="weight-500">Today's Payment</div>
          </div>
          <div className="progress-data">
            <div id="chart" />
          </div>
        </div>
      </div>
    </div>
    <div className="col-xl-3 mb-50">
      <div className="bg-white widget-style1 border-radius-10 height-100-p box-shadow">
        <div className="d-flex flex-wrap align-items-center">
          <div className="circle-icon">
            <div className="icon border-radius-100 font-24 text-blue">
              <i className="fa fa-handshake-o" aria-hidden="true" />
            </div>
          </div>
          <div className="widget-data">
            <div className="weight-800 font-18">₹{data.weekTotal}</div>
            <div className="weight-500">Last Week Payment</div>
          </div>
          <div className="progress-data">
            <div id="chart2" />
          </div>
        </div>
      </div>
    </div>
    <div className="col-xl-3 mb-50">
      <div className="bg-white box-shadow border-radius-10 height-100-p widget-style1">
        <div className="d-flex flex-wrap align-items-center">
          <div className="circle-icon">
            <div className="icon border-radius-100 font-24 text-blue">
              <i className="fa fa-bullhorn" aria-hidden="true" />
            </div>
          </div>
          <div className="widget-data">
            <div className="weight-800 font-18">₹{data.monthlyTotal}</div>
            <div className="weight-500">Last Month Payment</div>
          </div>
          <div className="progress-data">
            <div id="chart3" />
          </div>
        </div>
      </div>
    </div>
    <div className="col-xl-3 mb-50">
      <div className="bg-white box-shadow border-radius-10 height-100-p widget-style1">
        <div className="d-flex flex-wrap align-items-center">
          <div className="circle-icon">
            <div className="icon border-radius-100 font-24 text-blue">
              <i className="fa fa-dollar" aria-hidden="true" />
            </div>
          </div>
          <div className="widget-data">
            <div className="weight-800 font-18">₹{data.monthlyTotal}</div>
            <div className="weight-500">Total Payment</div>
          </div>
          <div className="progress-data">
            <div id="chart4" />
          </div>
        </div>
      </div>
    </div>
  </div>
     
  
  )
}

export default Wid