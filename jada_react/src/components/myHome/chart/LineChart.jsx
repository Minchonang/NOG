import React from 'react';
import {  Line } from 'react-chartjs-2';
import style from './css/MyChart.module.css';
import 'chart.js/auto';

// import 'chartjs-plugin-datalabels'; // 추가한 플러그인을 import

const LineChart = () => {
  
  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: '내 소비',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'red',
        tension: 0.1,
      },


      {
        label: '지역주민',
        data: [ 59, 80, 81, 56, 55, 40,10],
        fill: false,
        borderColor: 'yellow',
        tension: 0.1,
      },
    ],
  };

  return (
    
          <Line data={lineData} className={style.line_chart}/>
   
  );
};

export default LineChart;
