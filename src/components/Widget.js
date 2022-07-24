import "../styles/Widget.scss"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import { makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"
import moment from "moment";
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
  const [transactionsTotal, setTransactionsTotal] = useState({});
  const today = moment().format("YYYY-MM-DD");
  const fullMonth = moment().subtract(30, "d").format("YYYY-MM-DD");
  const sevendays = moment().subtract(7, "d").format("YYYY-MM-DD");
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const classes = useStyles();
  let data;
  useEffect(() => {
    const q = query(collection(db, "PayFee"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const Transactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(Transactions);
    });
    return () => unsubscribe();
  }, []);
  var getsevendays;
  const Days = transactions.filter((item) => {
    return (
      (getsevendays = moment(item.timestamp.seconds * 1000).format(
        "YYYY-MM-DD"
      )),
      getsevendays >= sevendays && getsevendays <= today
    );
  });

  const SevenDaysAmount = Days.map((item) => item.Amount).reduce(
    (prev, curr) => prev + curr,
    0
  );

  var daysOfMonth;
  const LastThirtyDays = transactions.filter((item) => {
    return (
      (daysOfMonth = moment(item.timestamp.seconds * 1000).format(
        "YYYY-MM-DD"
      )),
      daysOfMonth >= fullMonth && daysOfMonth <= today
    );
  });
  const Thirty_Days_Amount = LastThirtyDays.map((item) => item.Amount).reduce(
    (sum, item) => sum + item,
    0
  );
  const CurrentAmount = transactions.filter((item) => {
    return moment(item.timestamp.seconds * 1000).format("YYYY-MM-DD") === today;
  });
  const TodayAmount = CurrentAmount.map((item) => item.Amount).reduce(
    (prev, curr) => prev + curr,
    0
  );

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