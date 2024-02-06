import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import style from './css/MyChart.module.css';

const PieChart = () => {
  
  const data = {
    labels: [
      '아침',
      '오후',
      '저녁',
      '심야,새벽'
    ],
    datasets: [{
      label: 'usage %',
      data: [110, 10, 60,50],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'purple'
      ],
      // hoverOffset: 10
    }]
  };

  const options= {
    responsive: true,
    // maintainAspectRatio: true,
    aspectRatio:1.5,


    plugins: {
      legend: {
        // display: false,
        
        labels: {
          font: {
              size: 7,

          },
 
      },            
      },

    }

  }

  return (

          <Doughnut  data={data} options={options}  className={style.pie_chart}/>
  );
};

export default PieChart;
