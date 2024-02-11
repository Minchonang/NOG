import React from 'react';
import { Bar } from 'react-chartjs-2';
import style from './css/MyChart.module.css';

const BarChartMonth = ({data5}) => {
  // data5[0].keys()
  let label = [0]
  let myData = [];
  let cityData = [];
  let keys =[]
  if (data5 && Array.isArray(data5) && data5.length > 0 && typeof data5[0] === 'object') {
    // console.log(Object.keys(data5[0]));
  label = Object.keys(data5[1])
    console.log(data5[0]["1"])
  keys = Object.keys(data5[1]);

  }
  keys.forEach(key => {
    const value = data5[0][key] !== undefined ? data5[0][key] : 0;
    myData.push(value);
    cityData.push(data5[1][key]);
  });
  // console.log(data5[1].keys())
    const labels = label;
    const data = {
      labels: labels,
      datasets: [{


        label: ['나의 소비'],
        data: myData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
        
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          
        ],
        borderWidth: 1,
        
      },{


        label: ['도시 소비 평균'],
        data: cityData,
        backgroundColor: [
          'rgba(153, 102, 255, 0.5)',
        
        ],
        borderColor: [
          'rgb(153, 102, 255)',
          
        ],
        borderWidth: 1
      },{


        label: ['나의 소비라인'],
        type:'line',
        data: myData,
        backgroundColor: [
          'rgba(255, 255, 255, 1)',
        
        ],
        borderColor: [
          'rgba(255, 0, 0, 1)',
          
        ],
        borderWidth:4,
      },
      {


        label: ['도시 평균 소비라인'],
        type:'line',
        data: cityData,
        backgroundColor: [
          'rgba(255, 255, 255, 1)',
        
        ],
        borderColor: [
          'rgba(10, 100, 250, 0.9)',
          
        ],
        borderWidth: 4,
        tension: 0.5,
      },
    
    
    
    
    ]
    };
    const option = {
      maxBarThickness: 10,
      grouped: true,
      interaction: {
        mode: 'index',
      },
      plugins: {
      
        legend: {
          labels: {
            usePointStyle: true,
            // padding: 10,
            font: { // 범례의 폰트 스타일도 지정할 수 있습니다.
              family: "'Noto Sans KR', 'serif'",
              lineHeight: 1,
            },
          },
         
          display: true,
          
        },
      
        tooltip: { // 툴팁 스타일링
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          // 툴팁 색상을 지정할 수 있습니다.
          padding: 10,
          // 툴팁 패딩을 지정할 수 있습니다.
          bodySpacing: 5,
          // 툴팁 내부의 항목들 간 간격을 조정할 수 있습니다.
          bodyFont: {
            font: { // 툴팁 내용의 폰트 스타일을 지정할 수 있습니다.
              family: "'Noto Sans KR', sans-serif",
            }
          },
          usePointStyle: true,
        }
          
      
      },
      scales: {
        x: {
          
          grid: {// x축을 기준으로 그려지는 선(세로선)에 대한 설정
            display: false, // 선이 아예 안 그려지게 됨
            drawTicks: true, // 눈금 표시 여부를 지정
            tickLength: 4, // 눈금 길이를 지정
            color: 'black'
          },
          axis: 'x',
          position: 'bottom', // x 축 표시 위치
          ticks: {
            minRotation: 0, // x축 값의 회전 각도
            padding: 5, // x축 값의 상하 패딩
          },
        },
        y: {
          type: 'linear',// 리니어 스케일뿐만 아니라 로그 스케일로도 표시할 수 있다.
          grid: {
            color: 'rgba(0, 50, 100, 0.3)',
          },
          afterDataLimits: (scale) => {
            //afterDataLimits 콜백을 사용하여 y축의 최대값을 좀 더 여유있게 지정
            scale.max = scale.max * 1.2;
          },
          axis: 'y',// 이 축이 y축임을 명시해준다.
          display: true,// 축의 가시성 여부도 설정할 수 있다.
          position: 'left',// 축이 왼쪽에 표시될지, 오른쪽에 표시될지 정할 수 있다.
          title: {
            display: true,
            align: 'end',
            color: '#808080',
            font: {
              // size: 12,
              // family: "'Noto Sans KR', sans-serif",
              // weight: 300,
            },
            text: '(단위: kWh)'
          }
        },
      }
      
      }


  return (

          <Bar  data={data} options={option} className={style.bar_chart}/>
  );
};

export default BarChartMonth;
