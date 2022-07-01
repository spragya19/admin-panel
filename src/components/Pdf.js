import sch from "../assets/sch.png";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import {
 
  Card,
  CardContent,
  CardHeader,
  Divider,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";



const useStyles = makeStyles(() => ({

  pdfView: {
    width: "100%",
  },
  pdflist: {
    marginBottom: "20px",
  },
  total: {
    width: "100%",

    borderCollapse: "collapse",
    marginTop: "30px",
    "& td": {
      textAlign: "center",
      border: "none",
      padding: "10px 0",

      borderBottom: "1px solid",
    },
    "& th": {
      backgroundColor: "#0067B8",
      color: "#fff",
      padding: "10px 0",
      borderRadius: "5px",
    },
  },
}));
const Pdf = ({ row, fee, time, pendingFees }) => {

  const classes = useStyles();
  const pdfRef = useRef(null);

  
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (
    <>
      <div >
        <Card>
          <div className="title">
            <img src={sch} alt="Company logo" style={{ width: "80px" }} />
          </div>
          <CardHeader title="PRE SCHOOL" className={classes.InvoiceHead} />
          <CardHeader title="INVOICE" className={classes.InvoiceHead} />
          <CardContent>
            <ListItemText>User Code:- {row?.userName} </ListItemText>
            <ListItemText>User Name:- {row?.name} </ListItemText>
            <ListItemText>Class:- {row.Class} </ListItemText>
            <ListItemText>RollNumber:- {row?.rollNumber} </ListItemText>
            <ListItemText>Admission Fee:- {fee?.admissionfee}</ListItemText>
          
            <ListItemText>Monthly Fee Paid:-  {fee?.monthlyfee} </ListItemText>
            <ListItemText>Transaction Date:- {time} </ListItemText>
            <ListItemText>Pending Fees:- {pendingFees} </ListItemText>
          </CardContent>
        </Card>
        <Divider />
      </div>
    
    </>
  );
};

export default Pdf;
