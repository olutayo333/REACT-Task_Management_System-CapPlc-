import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { CDBContainer } from 'cdbreact';
const Home = () => {
  
  const [data] = useState({
    labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
    datasets: [
      {
        label: 'My First dataset',
        backgroundColor: 'rgba(194, 116, 161, 0.5)',
        borderColor: 'rgb(194, 116, 161)',
        data: [65, 59, 90, 81, 56, 55, 40],
      },
      {
        label: 'My Second dataset',
        backgroundColor: 'rgba(71, 225, 167, 0.5)',
        borderColor: 'rgb(71, 225, 167)',
        data: [28, 48, 40, 19, 96, 27, 100],
      },
    ],
  });

  const data2 ={
        labels:["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        datasets:[
            {
                labels:"Hours Studied",
                data:[2,5,7,8,9],
                backgroundColor:['blue', 'green', 'yellow', 'pink', 'orange']
            }
        ]
    }
  ChartJS.register(ArcElement, Tooltip, Legend);

  return (
    <CDBContainer>
    
      Chart JS
      <Doughnut data={data} options={{ responsive: true }}/>
    </CDBContainer>
  );
};

export default Home;