import {React, useState} from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import style from './css/MyChart.module.css';
import 'chart.js/auto';
import RadarChart from './RadarChart';
import PieChart from './PieChart';
import LineChart from './LineChart';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';

// import 'chartjs-plugin-datalabels'; // 추가한 플러그인을 import

const MyChart = () => {
  const [visibleContainers, setVisibleContainers] = useState({});
  const handleBoxClick = (boxNum) => {
    setVisibleContainers((prevContainers) => ({
      ...prevContainers,
      [boxNum]: !prevContainers[boxNum],
    }));
  };
  return (
    <div className={style.body}>
      <div className={style.container}>
        <div className={style.title}>
          <h1> USER01님의 패턴분석</h1>
          <span>광주광역시 광산구</span>
        </div>

        <div className={style.keyword_box} onClick={()=>handleBoxClick(1)}>
          <h1>120kw </h1>
          <span>이달 사용 전력</span>

          <h1>23,500원</h1>
          <span>사용요금</span>

          <h1>500원</h1>
          <span>직전달 대비 절약 금액</span>
        </div>
        {/*도넛 차트 박스  */}
        <div className={style.box_container}>
         <div className={style.chart_box}>
            {/* 도넛 제목 박스 */}
            <div className={style.chart_title_box}>
              <h1 className={style.chart_box_title}>이달 소비 전력량(kW) </h1>
              <span className={style.spring}></span>          
              <span className={style.close}> ▲</span>
            </div>

            <DoughnutChart />

            {/* 해설상자 */}
            <div className={style.text_box}>
           
            <p >이번달 사용량은 120kw 입니다. 이는 매달 평균 사용량 356kw의 56%에 해당합니다. </p>     
            <p>또한 현재까지의 요금은 약 12500원 이며, 이 패턴의 소비가 계속 되었을때 NGO가 평가한</p>     
            <p> 이달 예상 총 사용량은 542kw, 요금은 12344원입니다.</p>
            </div>

        </div>
       
        
        </div>
        


        <div className={style.keyword_box}>
          <h1> 오후 소비형</h1>
          <span>가장 많은 소비시간대</span>

        </div>

        {/* 두번째 줄 */}
        <div className={style.box_container}> 
        <div className={style.chart_box}>
          <span className={style.chart_box_title}>소비 유형 </span>          
          <PieChart />
        </div>
        </div>
        <div className={style.keyword_box}>
          <h1>금요일</h1>
          <span>소비량이 가장 많은 요일</span>
          
        </div>
        <div className={style.box_container}> 

<div className={style.chart_box}>
  <span className={style.chart_box_title}>요일별 소비 패턴</span>      
  <LineChart></LineChart>
</div>
</div>




        <div className={style.keyword_box}>
          <h1>13일</h1>
          <span>이달 가장 사용량이 많았던 날</span>
        </div>   

        <div className={style.box_container}> 

<div className={style.chart_box}>
  <span className={style.chart_box_title}>이달 소비 패턴</span>      
  <LineChart></LineChart>
</div>
</div>
        <div className={style.keyword_box}>
          <h1>4kW</h1>
          <span>하루 평균 사용량</span>
        </div>


        <div className={style.box_container}> 

        <div className={style.chart_box}>
          <span className={style.chart_box_title}>평균 소비 패턴</span>      
          <LineChart></LineChart>
        </div>
        </div>




        <div className={style.keyword_box}>
          <h1>54%</h1>
          <span>지역주민 대비 사용량</span>
        </div>
       
      <div className={style.box_container}> 
       

       <div className={style.chart_box}>
         <span className={style.chart_box_title}>도시인구 대비 비교</span>          
         <RadarChart />
       </div>

    
     <div className={style.chart_box}>

          <span className={style.chart_box_title}>비교</span>      

           
           <BarChart></BarChart>
           </div>

        </div>


     


      
      



 






      </div>
    </div>
  );
};

export default MyChart;
