import React from "react";
import "../styles/Board.css";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import Spinner from "./Spinner";
import Wid from "./Wid";
import Bargraph from "./Bargraph";
import Piechart from "./Piechart";


const Board = () => {
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
      <h1>hello</h1>
      {data.loading ? (
        <Spinner />
      ) : (
        <div className="top-Board">
          <div className="main__container">
            <Wid />
          </div>
          <div className="grap">
            <div className="pie">
              <Piechart />
             
            </div>
            <div className="graph">
              <Bargraph />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Board;
