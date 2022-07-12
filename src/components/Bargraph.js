import React from "react";
import { MDBContainer } from "mdbreact";
import { Bar } from "react-chartjs-2";
import "../styles/Bargraph.css"
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
  
const  Bargraph = () => {
  const options = {
    title: {
      text: 'Total Student Graph'
    },
    chart: {
      type: 'column'
    },
    series: [{
      data: [1, 2, 3, 4, 5,6,7,8,9,10,11,12 ,13]
    }],

    yAxis: {
      title: {
        text: 'Total Student'
      }
  
    },
    xAxis:  {
      title: {
        text: 'Class'
      }
    },
    
  
  }
  
  
  
  return (
    <div >
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  </div>
  );
}
  
export default Bargraph;
