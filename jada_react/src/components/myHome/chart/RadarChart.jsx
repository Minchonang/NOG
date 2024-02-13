import React from 'react';
import { Radar } from 'react-chartjs-2';
import style from './css/MyChart.module.css';

const RadarChart = () => {
  const data = {
    labels: ['5-10', '11-16', '17-22', '23-4'],
    datasets: [
      {
        label: '도시인구 평균',
        data: [302, 30, 30, 10], // 각 시간대별 사용한 시간 (예: 시간 단위)
        backgroundColor: 'rgba(0, 99, 155, 0.2)',
        borderColor: 'rgba(0, 99, 132, 1)',
        borderWidth: 2,
        lineTension:0.5
      },
      
      {
        label: '내 사용시간 ',
        data: [205, 302, 60, 10], // 각 시간대별 사용한 시간 (예: 시간 단위)
        backgroundColor: 'rgba(255, 0, 155, 0.2)',
        borderColor: 'rgba(0, 99, 0, 1)',
        borderWidth: 2,
        lineTension:0.5
      },

    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,

    aspectRatio:1.5,
    scales:{
      r:{
        grid:{
      color:'white',

    },
    suggestedMin: 0, // Y 축의 최솟값을 0으로 설정 (기본값)
    ticks: {
      stepSize: 50, // Y 축의 간격을 설정
      color:'white',
      backdropColor:'rgba(0, 0, 255, 0.2)',
    
    },
  }
},
    
    plugins: {
        legend: {
          // display: false,
          
          labels: {
            font: {
                size: 10,

            },
   
        },            
        },

      }
  };

  return (

          <Radar data={data} options={options}  className={style.radar_chart}/>
  );
};

export default RadarChart;
