import "../styles/Widget.scss"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import { makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"
import moment from "moment";
import {  orderBy, getDocs, where } from "firebase/firestore";



const useStyles = makeStyles(
  () => ({
    icon: {
      borderRadius: "30px",
      padding: "5px",
    },
  }),
  []
);
const Widget = ({ type }) => {

  const [transactions, setTransactions] = useState([]);
  const [data, setData] = useState({
    noOfStudents: "Loading...",
    noOfUsers: "Loading...",
    todayTotal: "Loading...",
    weekTotal: "Loading...",
    monthlyTotal: "Loading...",
    loading: false,
  });
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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
  switch (type) {
    case "todaysPayment":
      data = {
        amount: numberWithCommas(TodayAmount),
        title: "Today`s Payment",
        isMoney: true,
        link: "See all users",
        icon: (
          <BarChartIcon
            sx={{ fontSize: 50 }}
            className={classes.icon}
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "sevendaysPayment":
      data = {
        amount: numberWithCommas(SevenDaysAmount),
        title: "Last 7 day`s Payments",
        isMoney: true,
        link: "View all orders",
        icon: (
          <BarChartIcon
            sx={{ fontSize: 50 }}
            className={classes.icon}
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "monthPayment":
      data = {
        amount: numberWithCommas(Thirty_Days_Amount),
        title: "Last 30 day`s Payments",
        isMoney: true,
        link: "View net earnings",
        icon: (
          <BarChartIcon
            sx={{ fontSize: 50 }}
            className={classes.icon}
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "TotalPayment":
      data = {
        amount: numberWithCommas(Thirty_Days_Amount),
        title: "Total Payments",
        isMoney: true,
        link: "See details",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            sx={{ fontSize: 50 }}
            className={classes.icon}
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="right">{data.icon}</div>
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "₹"} {data.amount}
        </span>
      </div>
    </div>
  );
};

export default Widget;