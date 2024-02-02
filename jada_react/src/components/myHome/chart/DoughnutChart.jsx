import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import style from './css/MyChart.module.css';

const DoughnutChart = () => {
    const doughnutData = {
        labels: ['Red', 'Blue'],
        datasets: [
          {
            data: [60,40],
            backgroundColor: ['yellow', 'darkgray'],
            hoverBackgroundColor: ['red', 'black'],
          },
        ],
      };
    
      const doughnutOptions = {
        responsive: true,
        aspectRatio:1|2,
        
        plugins: {
    
          
          legend: {
            display: false,
          },
          title: {
            display: false,
            text: '234%', // 여기에 원하는 제목을 입력하세요.
            font: {
              size: 10,
            },
          },
          tooltips: {
            enabled: false, // 툴팁 비활성화
          },
        
        },
        maintainAspectRatio: true,
        cutoutPercentage: 400,
        animation: true,
        rotation: 290,
        circumference: 45 * Math.PI,
      };
    


  return (

          <Doughnut  data={doughnutData} options={doughnutOptions} className={style.doughnut_chart}/>
  );
};

export default DoughnutChart;
