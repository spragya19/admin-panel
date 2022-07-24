import React from "react";
import { CircularProgressbar,  buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import "../styles/Piechart.css"

const Piechart = () => {
  const [data, setData] = useState({
    noOfStudents: "Loading...",
    noOfUsers: "Loading...",
    todayTotal: "Loading...",
    weekTotal: "Loading...",
    monthlyTotal: "Loading...",
    loading: false,
  });

  const [transactionsTotal, setTransactionsTotal] = useState({});
  const percentage = 44;
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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
    console.log(data.noOfStudents, "studentss");
  }, []);

  return (
    <>
    <div className="pie-chart-section"></div>
      <div className="prog text-center mt-0 font-17">Revenue</div>
      <div className="pro mt-1">
        <CircularProgressbar value={percentage} text={`${percentage}%`} className="pie-bar"
          
          
           />
        <p class="text-center mt-0  mt-2 font-18  text-truncate">
          Total Payment
        </p>
        <h2 className="text-center mt-0  ">{"₹"+numberWithCommas(data.monthlyTotal)}</h2>
        <div className=" mt-5 d-flex">
          <div >
            <p class="text-muted font-15 mb-1 text-truncate mr-4">Today's Payment</p>
            <h4>
              <i className="fe-arrow-down text-danger me-1"></i>
              {"₹"+numberWithCommas(data.todayTotal)}
            </h4>
          </div>
          <div >
            <p className="text-muted font-15 mb-1 text-truncate mr-4">
              Last week payment
            </p>
            <h4>
              <i className="fe-arrow-up text-success me-1"></i>{"₹"+numberWithCommas(data.weekTotal)}
            </h4>
          </div>
          <div >
            <p className="text-muted font-15 mb-1 text-truncate mr-4">
              Last Month Payment
            </p>
            <h4>
              <i className="fe-arrow-up text-sucess me-1">
                {"₹"+numberWithCommas(data.monthlyTotal)}
              </i>
            </h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default Piechart;
