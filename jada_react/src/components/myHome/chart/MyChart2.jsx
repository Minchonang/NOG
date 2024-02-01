import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import style from './css/MyChart.module.css';

const MyChart = () => {
  const doughnutData = {
    labels: ['Red', 'Blue'],
    datasets: [
      {
        data: [40, 60],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        
      },
      doughnutlabel: { 
        labels: [{     
                  text: '0',    
                    font: {       
                      size: 20,      
                              weight: 'bold'   
                                      }            },
                                      {                text: 'total'            }]          }
    },
    maintainAspectRatio: false,
    cutoutPercentage: 70,
    animation: false,
    rotation: 290,
    circumference: 45 * Math.PI,
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className={style.body}>
      <div className={style.container}>
        <div className={style.title}>
          <h1>user</h1>
          <span>@@@@@@@</span>
          <span>@@@@@@@@.</span>
        </div>

        <div className={style.chart_box}>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>

        <div className={style.chart_box}>
          <Line data={lineData} />
        </div>

        <div className={style.chart_box}>
          <Line data={lineData} />
        </div>

        <div className={style.chart_box}>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
};

export default MyChart;
