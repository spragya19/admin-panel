import React from 'react'
// import '@fortawesome/fontawesome-free/css/all.min.css';  
// import 'bootstrap-css-only/css/bootstrap.min.css';  
// import 'mdbreact/dist/css/mdb.css';
import { MDBContainer } from "mdbreact";
import { Pie } from "react-chartjs-2";

const Piechart = () => {
    const data = {
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          datasets: [
            {
              label: "Hours Studied in Geeksforgeeks",
              data: [2, 5, 6, 7, 3],
              backgroundColor: ["blue", "green", "yellow", "pink", "orange"],
            }
          ]
      }
  return (
    <MDBContainer>
      <Pie data={data} />
    </MDBContainer>
  )
}

export default Piechart