import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { CDBContainer } from 'cdbreact';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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

//DOWNLOAD BY PDF
  // const printRef = React.useRef();

  // const handleDownloadPdf = async () => {
  //   const element = printRef.current;
  //   const canvas = await html2canvas(element);
  //   const data = canvas.toDataURL('image/png');

  //   const pdf = new jsPDF();
  //   const imgProperties = pdf.getImageProperties(data);
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight =
  //     (imgProperties.height * pdfWidth) / imgProperties.width;

  //   pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //   pdf.save('print.pdf');
  // };

  const handleDownloadPdf = ()=> {
    const doc = new jsPDF();

    doc.text("Hello world!", 10, 10);
    doc.save("a4.pdf");
  }

  return (
    <CDBContainer>
      <button type="button" onClick={handleDownloadPdf}>
        Download as PDF
      </button>

      <div>I will not be in the PDF.</div>
      {/* <div ref={printRef}>I will be in the PDF.</div> */}
      
      Chart JS
      <Doughnut data={data} options={{ responsive: true }}/>
    </CDBContainer>
  );
};

export default Home;