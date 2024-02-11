import React from 'react';
import { Bar } from 'react-chartjs-2';
import style from './css/MyChart.module.css';

const BarChartDay = () => {
  
    const labels = ["나의 평균 소비량","지역 평균 소비량"];
    const data = {
      labels: labels,
      datasets: [{


        label: ['단위 (kWh)'],
        data: [5,6],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(153, 102, 255)',
          
        ],
        borderWidth: 2
      },
    
    
    
    
    ]
    };
    const doughnutOptions = {
   
      plugins: {
      
        legend: {
          display: false,
        },}}

        
  return (

          <Bar  data={data} options={doughnutOptions} className={style.bar_chart}/>
  );
};

export default BarChartDay;
