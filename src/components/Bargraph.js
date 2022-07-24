import React, {useEffect} from "react";
import { MDBContainer } from "mdbreact";
import { Bar } from "react-chartjs-2";
import "../styles/Bargraph.css";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const Bargraph = () => {
  const [data, setData] = useState({
    noOfStudents: "Loading...",
   
    loading: true,
  });
  
  const [dummy, setDummy] = useState()

  const [stuData, setStuData] = useState({
    "1st": 0,
    "2nd": 0,
    "3rd": 0,
    "4th": 0,
    "5th": 0,
    "6th": 0,
    "7th": 0,
    "8th": 0,
    "9th": 0,
    "10th": 0,
    "11th": 0,
    "12th": 0,
  });


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




  useEffect(() => {
    async function getData() {
      let querys = null;
    querys = collection(db, "student");
    const querySnapshot = await getDocs(querys);
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ ...doc.data(), id: doc.id });
    });
    setDummy(list)
    let flag = false;
    let val = null;
    let filteredData = [];
    for(let i in list) {
      flag = false;
      for(let j in filteredData) {
        if(filteredData[j][list[i].Class]) {
          flag = true;
          val = filteredData[j][list[i].Class];
          filteredData[j][list[i].Class] = val + 1;
          break;
        }
      }
      if(!flag)
      filteredData.push({[list[i].Class]: 1});
    }

    filteredData = filteredData;
    let newData = {};

    for(let i in filteredData)  {
      newData = {...newData, ...filteredData[i]}
    }

    setStuData(oldData => {return {...oldData, ...newData}});
    setData(oldData => {return {...oldData, loading: false}});
    }
    getData();
  }, []);

 
  const options = {
    title: {
      text: " Student Graph",
    },
    chart: {
      type: "column",
    },

    yAxis: {
      title: {
        text: " Students",
      },
    },
    xAxis: {
      title: {
        text: "Classes",
      },
      categories: [
        '1st',
        '2nd',
        '3rd',
        '4th',
        '5th',
        '6th',
        '7th',
        '8th',
        '9th',
        '10th',
        '11th',
        '12th'
    ],
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: "{point.y}",
        },
      },
    },
    series: [
      {
        name: "Number of Students",
        colorByPoint: true,
        data: [
          {
            name: "1st",
            y: stuData["1st"],
          },
          {
            name: "2nd",
            y: stuData["2nd"],
          },
          {
            name: "3rd",
            y: stuData["3rd"],
          },
          {
            name: "4th",
            y: stuData["4th"],
          },
          {
            name: "5th",
            y: stuData["5th"],
          },
          {
            name: "6th",
            y: stuData["6th"],
          },
          {
            name: "7th",
            y: stuData["7th"],
          },
          {
            name: "8th",

            y: stuData["8th"],
          },
          {
            name: "9th",
            y: stuData["9th"],
          },
          {
            name: "10th",
            y: stuData["10th"],
          },
          {
            name: "11th",
            y: stuData["11th"],
          },
          {
            name: "12th",
            y: stuData["12th"],
          },
          
        ],
        plotOptions: {
          series: {
              allowPointSelect: true
          }
      }
      },

      {
        name: 'No of Students',
        type: 'spline',
        data: [
          {
            name: "1st",
            y: stuData["1st"],
          },
          {
            name: "2nd",
            y: stuData["2nd"],
          },
          {
            name: "3rd",
            y: stuData["3rd"],
          },
          {
            name: "4th",
            y: stuData["4th"],
          },
          {
            name: "5th",
            y: stuData["5th"],
          },
          {
            name: "6th",
            y: stuData["6th"],
          },
          {
            name: "7th",
            y: stuData["7th"],
          },
          {
            name: "8th",

            y: stuData["8th"],
          },
          {
            name: "9th",
            y: stuData["9th"],
          },
          {
            name: "10th",
            y: stuData["10th"],
          },
          {
            name: "11th",
            y: stuData["11th"],
          },
          {
            name: "12th",
            y: stuData["12th"],
          },
          
        ],
        plotOptions: {
          series: {
              allowPointSelect: true
          }
      }
      }
    ],
  };

  

  return (
    <>
    {!data.loading && <div>

      <HighchartsReact highcharts={Highcharts} options={options} />
       <p className="text-center font-15 mb-1 mt-5 text-truncate">
          Total Admission
        </p>
        <h2 className="text-center mt-0 mb-5 ">{data.noOfStudents} students </h2>
    </div>}
    </>
  );
};

export default Bargraph;
