import { FaRegFilePdf } from "react-icons/fa";
import sch from "../assets/sch.png";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { jsPDF } from "jspdf";


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

const Pdf = ({ row }) => {


  const classes = useStyles();
  const pdfRef = useRef(null);

  const handleDownload = () => {
    
    const Content = pdfRef.current;
    const pdf = new jsPDF("p", "px", "a4");
    Content.style.display = "block";
    pdf.html(Content, {
      callback: function (pdf) {
        pdf.save("Invoice.pdf");
        Content.style.display = "none";
      },
      html2canvas: { scale: 0.6 },
      x: 10,
      y: 10,
      height: 300,

      width: 200,
      windowWidth: 700,
    });
  };

  return (
    <>
      <div ref={pdfRef} style={{ display: "none", position: "absolute" }}>
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
            <ListItemText>Fee Type:- {row?.feeType} </ListItemText>
            <ListItemText>FeeAmount:- {row?.feeAmount} </ListItemText>
          </CardContent>
        </Card>
        <Divider />
      </div>
      <Button onClick={handleDownload}>
        <FaRegFilePdf style={{ color: "red", width: "20px", height: "20px" }} > </FaRegFilePdf>
      </Button>
    </>
  );
};

export default Pdf;
