import React from 'react';
import {  Line } from 'react-chartjs-2';
import style from './css/MyChart.module.css';
import 'chart.js/auto';

// import 'chartjs-plugin-datalabels'; // 추가한 플러그인을 import

const LineChart = ({data3}) => {
 
  const my_usage = data3["weekly_my_usage_sum"]
  const city_usage = data3["weekly_city_usage_sum"]
  
  const lineData = {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    datasets: [
      {
        label: '나의 소비',
        data: [
          my_usage && my_usage["Monday"] ? my_usage["Monday"] : 0,
          my_usage && my_usage["Tuesday"] ? my_usage["Tuesday"] : 0,
          my_usage && my_usage["Wednesday"] ? my_usage["Wednesday"] : 0,
          my_usage && my_usage["Thursday"] ? my_usage["Thursday"] : 0,
          my_usage && my_usage["Friday"] ? my_usage["Friday"] : 0,
          my_usage && my_usage["Saturday"] ? my_usage["Saturday"] : 0,
          my_usage && my_usage["Sunday"] ? my_usage["Sunday"] : 0
        ],
        fill: true,
        borderColor: 'red',
        tension: 0.3,
      },


      {
        label: '도시평균',
        data: [
          city_usage && city_usage["Monday"] ? city_usage["Monday"] : 0,
          city_usage && city_usage["Tuesday"] ? city_usage["Tuesday"] : 0,
          city_usage && city_usage["Wednesday"] ? city_usage["Wednesday"] : 0,
          city_usage && city_usage["Thursday"] ? city_usage["Thursday"] : 0,
          city_usage && city_usage["Friday"] ? city_usage["Friday"] : 0,
          city_usage && city_usage["Saturday"] ? city_usage["Saturday"] : 0,
          city_usage && city_usage["Sunday"] ? city_usage["Sunday"] : 0
        ],
        fill: true,
        borderColor: 'yellow',
        tension: 0.3,
      },
    ],
  };

  return (
    
          <Line data={lineData} className={style.line_chart}/>
   
  );
};

export default LineChart;
