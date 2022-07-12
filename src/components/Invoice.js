import React from 'react';
import { renderToString } from "react-dom/server";
import jsPDF from "jspdf";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig"
import { useState } from "react";
import "../styles/Invoice.css"


import sch from "../assets/sch.png";


const Invoice = ({ row, fee, time, pendingFees }) => {
  
  
    
    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  return (
    <div> <div className="invoice-box">
    <table>
      <tr className="top">
        <td colSpan="2">

         
          <table  >
            <tr>
              
            </tr>
          </table>
        </td>
      </tr>

      <tr className="information">
        <td colSpan="2">
          <table>
            <tr>
                <tr>
            <td className="title mb-4">
                <img
                  src={sch} 
                  alt="Company logo"
                  style={{ width: "80px" }}
                />
              </td>

              <td>
                PRE SCHOOL
                <br />
               Panchkula, Haryana
                <br />
                -135001
              </td>
              </tr>
              <td>
                User Code: <span> {row?.userName}</span>
                <br />
                User Name: <span>{row?.name} </span>
                <br />
               
                Standard: <span>{row.Class}</span>
                <br />
                Roll Number: <span>{row?.rollNumber}</span>
                
              </td>

              <td>
              
                Transaction Date: <span>{time} </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr className="heading">
        <td>Transaction Type : </td>

        <td>Price</td>
      </tr>

     
      <tr className="total">
        <td> Admission Fee: </td>
        <td>₹{fee?.admissionfee}</td>
      </tr>

      <tr className="total">
        <td> Monthly Fee: </td>
        <td>₹{fee?.monthlyfee}</td>
      </tr>
      <tr className="total">
        <td> Total Fee: </td>
        <td>₹{fee?.admissionfee+fee?.admissionfee}</td>
      </tr>
    </table>
  </div></div>
  )
}

export default Invoice