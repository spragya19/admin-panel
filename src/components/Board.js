import React from "react";
import "../styles/Board.css";
import hello from "../assets/hello.svg";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import moment from "moment";
import Spinner from "./Spinner";

const Board = () => {
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
    <>
      {data.loading ? (
        <Spinner />
      ) : (
        <main>
          <div className="main__container">
            <div className="main__title">
              <img src={hello} alt="hello" />
              <div className="main_greeting">
                <h1>Admin Panel</h1>
                <p>welcome to admin panel</p>
              </div>
            </div>

            <div className="main__cards">
              <div className="card">
                <div className="card_inner">
                  <p className="text-primary-p">Total Students</p>
                  <span className="font-bold text-title">
                    {data.noOfStudents}
                  </span>
                </div>
              </div>

              <div className="card">
                <div className="card_inner">
                  <p className="text-primary-p">Total Users</p>
                  <span className="font-bold text-title">{data.noOfUsers}</span>
                </div>
              </div>

              <div className="card">
                <div className="card_inner">
                  <p className="text-primary-p">Awards</p>
                  <span className="font-bold text-title">10+</span>
                </div>
              </div>

              <div className="card">
                <div className="card_inner">
                  <p className="text-primary-p">Revenue</p>
                  <span className="font-bold text-title">40</span>
                </div>
              </div>
            </div>

            <div className="charts">
              <div className="charts__left">
                <div className="charts__left__title">
                  <div>
                    <h1>Daily Reports</h1>
                    <p>Admissions</p>
                  </div>
                  <i className="fa fa-usd"></i>
                </div>
              </div>

              <div className="charts__right">
                <div className="charts__right__title">
                  <div>
                    <h1>Daily Reports</h1>
                    <p>Student Admission</p>
                  </div>
                  <i className="fa fa-area-chart"></i>
                </div>

                <div className="charts__right__cards">
                  <div className="card1">
                    <h1 total={transactionsTotal.todayPayment}></h1>
                    <h5>Today's Payment</h5>
                    <p>₹{data.todayTotal}</p>
                  </div>

                  <div className="card2">
                    <h1 total={transactionsTotal.lastWeekPayment}></h1>
                    <h5>Last 7 Days Payments</h5>
                    <p>₹{data.weekTotal}</p>
                  </div>

                  <div className="card3">
                    <h1 total={transactionsTotal.lastMonth}></h1>
                    <h5>Last 30 Days Payments</h5>
                    <p>₹{data.monthlyTotal}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Board;
