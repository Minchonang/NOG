import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import style from './css/MyChart.module.css';

const DoughnutChart = () => {
    const doughnutData = {
        labels: ['사용량', '지역평균에서 차이나는 %p'],
        datasets: [
          {
            data: [100,40],
            backgroundColor: [ 'rgb(250, 185, 33)', 'gray'],
            hoverBackgroundColor: ['red', 'black'],
          },
        ],
      };
    
      const doughnutOptions = {
        responsive: true,
        aspectRatio:1|2,
        borderColor:'white',
        borderWidth: 10,
       


        plugins: {
        
          legend: {
            display: false,
          },
          title: {
            display: false,
            text: 152+"kw" ,
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
        // animation: true,
        rotation: 290,
        circumference: 45 * Math.PI,
      };
    


  return (
            <div className={style.doughnut_chart_box}>
          <Doughnut  data={doughnutData} options={doughnutOptions} className={style.doughnut_chart}/>
          <span className={style.doughnut_value}>120kW</span>          
          </div>
  );
};

export default DoughnutChart;
