import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import style from './css/MyChart.module.css';
import 'chart.js/auto';
import RadarChart from './RadarChart';
import PieChart from './PieChart';
import LineChart from './LineChart';
import BarChart from './BarChart';

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
        <div className={style.main_title}>
          <h1> USER01님의 패턴분석</h1>
          <span>광주광역시 광산구 </span>
        </div>

        <div className={style.title}>
          <h1>120kw </h1>
          <span>이달 사용 전력</span>
          <h1>23,500원</h1>
          <span>사용요금</span>
          <h1>500원</h1>
          <span>직전달 대비 절약 금액</span>
        </div>
        


        <div className={style.title}>
          <h1> 오후 소비형</h1>
          <span>가장 많은 소비시간대</span>

        </div>
        <div className={style.title}>
          <h1>금요일</h1>
          <span>소비량이 가장 많은 요일</span>
          
        </div>
        <div className={style.title}>
          <h1>13일</h1>
          <span>이달 가장 사용량이 많았던 날</span>
        </div>   

        <div className={style.title}>
          <h1>4kW</h1>
          <span>하루 평균 사용량</span>
        </div>
        <div className={style.title}>
          <h1>54%</h1>
          <span>지역주민 대비 사용량</span>
        </div>
        <div className={style.title}>
          <h1>54%</h1>
          <span>지역주민 대비 사용량</span>
        </div>
        <div className={style.title}>
          <h1>54%</h1>
          <span>지역주민 대비 사용량</span>
        </div>



      <div className={style.box_container_one}>
         <div className={style.chart_box}>
            <span className={style.chart_box_title}>이번달 소비 전력량(kW) </span>          

            <Doughnut data={doughnutData} options={doughnutOptions}  className={style.doughnut_chart}/>
            
            <span className={style.doughnut_value}>120kW</span>          
        </div>
        {/* <div className={style.chart_box}>

            <span className={style.chart_box_title}>이번달 소비 전력량(kW) </span>          

            <Doughnut data={doughnutData} options={doughnutOptions}  className={style.doughnut_chart}/>
            <span className={style.doughnut_value}>120kW</span>          
        </div> */}
        
        </div>

        {/* 두번째 줄 */}
      <div className={style.box_container_one}> 
        <div className={style.chart_box}>
          <span className={style.chart_box_title}>소비 유형 </span>          
          <PieChart />
        </div>

        {/* <div className={style.chart_box}>
          <span className={style.chart_box_title}>도시인구 대비 비교</span>          
          <RadarChart />
        </div> */}
      </div>

      <div className={style.box_container_one}> 
        {/* <div className={style.chart_box}>
          <span className={style.chart_box_title}>소비 유형 </span>          
          <PieChart />
        </div> */}

        <div className={style.chart_box}>
          <span className={style.chart_box_title}>도시인구 대비 비교</span>          
          <RadarChart />
        </div>
      </div>


        <div className={style.box_container_one}> 

        <div className={style.chart_box}>
          <span className={style.chart_box_title}>요일별 소비 패턴</span>      
          <LineChart></LineChart>
        </div>
        </div>

        <div className={style.box_container_one}> 

<div className={style.chart_box}>
  <span className={style.chart_box_title}>이달 소비 패턴</span>      
  <LineChart></LineChart>
</div>
</div>



        <div className={style.box_container_one}> 
          <span className={style.chart_box_title}>비교</span>      

           
           <BarChart></BarChart>

        </div>


      </div>
    </div>
  );
};

export default MyChart;
