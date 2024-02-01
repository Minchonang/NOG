import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import style from './css/MyChart.module.css';
import 'chart.js/auto';
import RadarChart from './RadarChart';
// import 'chartjs-plugin-datalabels'; // 추가한 플러그인을 import

const MyChart = () => {
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
    responsive: false,
    
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

      {/* <div> */}
         <div className={style.chart_box}>
            <span className={style.chart_box_title}>이번달 소비 전력량(kW) </span>          

            <Doughnut data={doughnutData} options={doughnutOptions}  className={style.doughnut_chart}/>
            <span className={style.doughnut_value}>120kW</span>          
        {/* </div> */}
        </div>

        <div className={`${style.chart_box} ${style.chart_box2}`}>
          <RadarChart className={style.radar_chart} />
          
          <RadarChart className={style.radar_chart} />
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
