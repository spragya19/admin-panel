import React from 'react'
import "../styles/Board.css";
import hello from  "../assets/hello.svg"
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import moment from "moment";

const Board = () => {

    const [transactions, setTransactions] = useState([]);
  
 
  const [transactionsTotal, setTransactionsTotal] = useState({});


    useEffect(() => {
        const fetchTransactions = async () => {
          try {
            const transactionQuery = query(
              collection(db, "transaction"),
              orderBy("timeStamp", "desc")
            );
            const transactionSnapshot = await getDocs(transactionQuery);
            const transactions = [];
            transactionSnapshot.forEach((doc) => {
              transactions.push({ transId: doc.id, ...doc.data() });
            });
            setTransactions(transactions);
    
            const todayPayment = await getTotal(0);
            const lastWeekPayment = await getTotal(7);
            const lastMonth = await getTotal(30);
            setTransactionsTotal({
              lastWeekPayment,
              todayPayment,
              lastMonth,
            });
          } catch (error) {
            console.log(error);
          }
        };
    
        fetchTransactions();
      }, []);
    
      const getTotal = async (days) => {
        console.log("testing    .....");
        console.log(days);
    
        const transactionsQuery = query(
          collection(db, "transaction"),
          where(
            "timeStamp",
            ">",
            moment().startOf("date").subtract(days, "d").utc()._d
          )
        );
    
        const transactionsSnapshot = await getDocs(transactionsQuery);
        const transactionsAmount = [];
        transactionsSnapshot.forEach((doc) => {
          transactionsAmount.push(doc.data().amount);
        });
    
        const totalAmount = transactionsAmount.reduce(function (total, current) {
          return total + current;
        }, 0);
    
        return totalAmount;
      };

  return (
   
      <main>
          <div className="main__container">{/* === Container === */}

              <div className="main__title">{/* === Title === */}
                  <img src={hello} alt="hello" />
                  <div className="main_greeting">
                      <h1>Admin Panel</h1>
                      <p>welcome to admin panel</p>
                  </div>
              </div>

              <div className="main__cards">
                  <div className="card">{/* === CARDS === */}
                      {/* <i className="fa fa-file-text fa-2x text-lightblue"></i> */}
                      <div className="card_inner">
                          <p className="text-primary-p">Total Student</p>
                          <span className="font-bold text-title">10000+</span>
                      </div>
                  </div>

                  <div className="card">{/* === CARDS === */}
                  {/* <i className="fa fa-money-bill fa-2x text-red"></i> */}
                      <div className="card_inner">
                          <p className="text-primary-p">Department</p>
                          <span className="font-bold text-title">60+</span>
                      </div>
                  </div>

                  <div className="card">{/* === CARDS === */}
                      {/* <i className="fa fa-archive fa-2x text-yellow"></i> */}
                      <div className="card_inner">
                          <p className="text-primary-p">Awards</p>
                          <span className="font-bold text-title">10+</span>
                      </div>
                  </div>

                  <div className="card">{/* === CARDS === */}
                      {/* <i className="fa fa-bars fa-2x text-green"></i> */}
                      <div className="card_inner">
                          <p className="text-primary-p">Revenue</p>
                          <span className="font-bold text-title">40</span>
                      </div>
                  </div>
              </div>

              <div className="charts">{/* === CHARTS ==== */}

                  <div className="charts__left">{/* === LEFT ==== */}
                      <div className="charts__left__title">
                          <div>
                              <h1>Daily Reports</h1>
                              <p>Admissions</p>
                          </div>
                          <i className="fa fa-usd"></i>
                      </div>
                      {/* <Charts /> */}
                      
                  </div>

                  <div className="charts__right">{/* === RIGHT === */}
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
                         </div>

                         <div className="card2">
                             <h1 total={transactionsTotal.lastWeekPayment}></h1>
                             <h5>Last 7 Days Payments</h5>
                         </div>

                         <div className="card3">
                             <h1 total= {transactionsTotal.lastMonth}></h1>
                             <h5>Last 30 Days Payments</h5>
                         </div>

                         {/* <div className="card4">
                             <h1>Boys</h1>
                             <p>250</p>
                         </div> */}
                     </div>
                  </div>
              </div>

          </div>
      </main>
  
  )
}

export default Board