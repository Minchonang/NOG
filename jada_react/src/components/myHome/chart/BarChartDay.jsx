import React from 'react';
import { Bar } from 'react-chartjs-2';
import style from './css/MyChart.module.css';

const BarChartDay = ({data4}) => {
  
    const labels = ["나의 평균 소비량","지역 평균 소비량"];
    const data = {
      labels: labels,
      datasets: [{


        label: ['단위 (kWh)'],
        data: [
          (data4 && data4.length > 1 && data4[0]) ? data4[0] : 0,
          (data4 && data4.length > 0 && data4[1]) ? data4[1] : 0,
      ],
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
    const option = {
   
      plugins: {
      
        legend: {
          display: true,
          
          labels: {
            color: 'black', // 범례 텍스트 색상
            font: {
              size: 15,

            },
          }, 
         

        },}}


  return (

          <Bar  data={data} options={option} className={style.bar_chart}/>
  );
};

export default BarChartDay;
