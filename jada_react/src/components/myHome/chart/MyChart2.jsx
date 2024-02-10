import {React, useEffect, useState} from 'react';
import style from './css/MyChart.module.css';
import axios from 'axios';
import 'chart.js/auto';
import RadarChart from './RadarChart';
import PieChart from './PieChart';
import LineChart from './LineChart';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';
import Plot from 'react-plotly.js';

const MyChart = () => {
  
  

  // 키워드 배너를 눌렀는지 값을 할당   
  const [visibleContainers, setVisibleContainers] = useState({});
  // 키워드 박스를 눌렀을 때 해당 키워드 박스에 해당하는 차트 박스를 on/off
  const handleBoxClick = (boxNum) => {
    setVisibleContainers((prevContainers) => ({...prevContainers,
      [boxNum]: !prevContainers[boxNum],

    }));
  };

  const [chartData1, setChartData1] = useState([]);
  const [chartData2, setChartData2] = useState([]);
  const [chartData2pattern, setChartData2pattern] = useState({});
  const [myType, setMyType] = useState({});
  const [userData ,setMyCity] = useState("")
  const [chartData3, setChartData3] = useState([]);
  const [chartData4, setChartData4] = useState([]);
  const [user, setUser] = useState({});
  
 
  useEffect(() => {
    sessionStorage.setItem("userId", "test5");
    const id = sessionStorage.getItem("userId");
    
    const fetchData = async () => {
      
      try {
        // axios로 GET 요청 보내기
        const response = await axios.get(`http://127.0.0.1:5001/test2?user_id=${id}`);
        
        // 응답에서 데이터 추출하고 상태 업데이트
        const data = response.data;
        setChartData1(data.data1)
        setChartData2(data.data2)
        setUser({
          "user_id" : id,
          "user_name"  : data.data2[0]["user_info"],
          "user_city" : data.data2[1]["user_info"]
                  })
          // 나의 월 소비 패턴 정의
          const my_pattern =data.data2[0];
          const total_usage = my_pattern["usage_23_4"] + my_pattern["usage_5_10"] + my_pattern["usage_11_16"] + my_pattern["usage_17_22"];
          const usage_23_4 = Math.round(my_pattern["usage_23_4"] / total_usage * 1000) / 10;
          const usage_5_10 = Math.round(my_pattern["usage_5_10"] / total_usage * 1000) / 10;
          const usage_11_16 = Math.round(my_pattern["usage_11_16"] / total_usage * 1000) / 10;
          const usage_17_22 = Math.round(my_pattern["usage_17_22"] / total_usage * 1000) / 10;

          const usageValues = [usage_23_4, usage_5_10, usage_11_16, usage_17_22];

          // 최대값 찾기
          const my_use_type= {
            "usage_23_4": usage_23_4,
            "usage_5_10": usage_5_10,
            "usage_11_16": usage_11_16,
            "usage_17_22": usage_17_22
        }

          setChartData2pattern(my_use_type)

        console.log(data);
        console.log(id);
      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    };
    fetchData();
  }, []);

  function calculateType(dict) {
    if (!dict || typeof dict !== 'object') {
      return null; 
    }

    let maxKey = null;
    let maxValue = 0;
    
    for (const [key, value] of Object.entries(dict)) {
      if (value > maxValue) {
        maxValue = value;
        maxKey = key;
      }
    }
    if (maxKey=="usage_23_4"){
      return "심야,새벽"
    }else if (maxKey=="usage_11_16"){
      return "오후"
    }else if (maxKey=="usage_5_10"){
      return "아침"
    }else if (maxKey=="usage_17_22"){
      return "저녁"
    }
  }
  // 요금 계산기
  function calculateBill(usage){
     let bill =0
    if (usage <= 300){
        bill = usage * 120.0
      }
    else if (usage <= 450){
        bill = 300 * 120.0 + (usage - 300) * 214.6
    }
    else{
        bill = 300 * 120.0 + 150 * 214.6 + (usage - 450) * 307.3}
    return bill
    }

  
  






  return (
    <div className={style.body}>
      <div className={style.container}>
        <div className={style.title}>
          <h1> {user["user_name"]? user["user_name"]+"님의 ":""}패턴분석 ♪</h1>
          <span>{user["user_city"]?user["user_city"]:""}</span>
        </div>

        <div className={style.keyword_box} onClick={()=>handleBoxClick(1)}>
          <h1>{chartData1["my_total_usage"]?chartData1["my_total_usage"]:0}kw </h1>
          <span>이달 사용 전력</span>

          <h1>{chartData1["my_total_usage"]?calculateBill(chartData1["my_total_usage"]).toLocaleString('ko-KR'):0}원</h1>
          <span>사용요금</span>

          <h1>{chartData1["my_total_usage"]?(calculateBill(chartData1["my_total_usage_last"])-calculateBill(chartData1["my_total_usage"])).toLocaleString('ko-KR'):0 }원</h1>
          <span>직전달 대비 절약 금액</span>
          <span className={style.open}> {visibleContainers['1'] ? '▲' :'▼'} </span>
        </div>
        {/*도넛 차트 박스  */}
        <div className={visibleContainers['1'] ? style.box_container : style.box_container_close}>
         <div className={style.chart_box}>
            {/* 도넛 제목 박스 */}
            <div className={style.chart_title_box} onClick={()=>handleBoxClick(1)}>
              <h1 className={style.chart_box_title}>이달 소비 전력량(kWh) </h1>
              <span className={style.spring}></span>          
              {/* <span className={style.close} > ▲</span> */}
            </div>
             <DoughnutChart data1={[chartData1["average_total_usage"], chartData1["my_total_usage"]]}/>
            
            <div >
    
    </div>
            {/* 해설상자 */}
            <div className={style.text_box}>
           
            <p >이번달 사용량은 {chartData1["my_total_usage"]}kwh 입니다. 이는 전달 지역 평균 사용량 {chartData1["average_total_usage"]}kwh의 { Math.round(chartData1["my_total_usage"]/chartData1["average_total_usage"] *1000)/10}% 에 해당합니다. </p>     
            <p>또한 현재까지의 요금은 약 {calculateBill(chartData1["my_total_usage"]).toLocaleString('ko-KR')}원 이며, 이 패턴의 소비가 계속 되었을때 NGO가 평가한</p>     
            <p> 이달 예상 총 사용량은 542kwh, 요금은 12344원입니다.</p>
            </div>

        </div>
       
        
        </div>
        


        <div className={style.keyword_box} onClick={()=>handleBoxClick(2)}>
          <h1>{calculateType(chartData2pattern)? calculateType(chartData2pattern) : "오전"} 소비 유형</h1>
          <span>가장 많은 소비시간대</span>
          <span className={style.open}> {visibleContainers['2'] ? '▲' :'▼'}</span>


        </div>

        {/* 두번째 줄 */}
        <div className={visibleContainers['2'] ? style.box_container : style.box_container_close}>

        <div className={style.chart_box}>
        <div className={style.chart_title_box} onClick={()=>handleBoxClick(2)}>

          <span className={style.chart_box_title}>소비 유형 </span> 
          <span className={style.spring}></span>     
          {/* <span className={style.close}> ▲</span>   */}
          </div>  

          <PieChart chart_Data2={chartData2pattern}/>
            {/* 해설상자 */}
            <div className={style.text_box}>
            
            <p >회원님의 전력 소비 시간대 비율은</p>     
            <p >- 아침 {chartData2pattern["usage_5_10"]}% </p>     
            <p >- 오후 {chartData2pattern["usage_11_16"]}%</p>     
            <p >- 저녁 {chartData2pattern["usage_17_22"]}% </p>     
            <p >- 심야새벽 {chartData2pattern["usage_23_4"]}% 입니다.</p>     
            <p>소중한 소비 데이터로 NGO가 평가한 고객님의 소비 유형은 '{calculateType(chartData2pattern)}' 소비형입니다.</p>     
            </div>
        </div>
        </div>
        <div className={style.keyword_box} onClick={()=>handleBoxClick(3)}>
          <h1>금요일</h1>
          <span>소비량이 가장 많은 요일</span>
          <span className={style.open}> {visibleContainers['3'] ? '▲' :'▼'}</span>

          
        </div>
        <div className={visibleContainers['3'] ? style.box_container : style.box_container_close}>
        

<div className={style.chart_box}>
<div className={style.chart_title_box} onClick={()=>handleBoxClick(3)}>

  <span className={style.chart_box_title}>요일별 소비 패턴</span> 
  <span className={style.spring}></span>     
          {/* <span className={style.close} > ▲</span>   */}
          </div>      
  <LineChart></LineChart>
    {/* 해설상자 */}
    <div className={style.text_box}>
           
           <p >이번달 사용량은 120kw 입니다. 이는 매달 평균 사용량 356kw의 56%에 해당합니다. </p>     
           <p>또한 현재까지의 요금은 약 12500원 이며, 이 패턴의 소비가 계속 되었을때 NGO가 평가한</p>     
           <p> 이달 예상 총 사용량은 542kw, 요금은 12344원입니다.</p>
           </div>
</div>
</div>




        <div className={style.keyword_box} onClick={()=>handleBoxClick(4)}>
          <h1>13일</h1>
          <span>이달 가장 사용량이 많았던 날</span>
          <span className={style.open}> {visibleContainers['4'] ? '▲' :'▼'}</span>

        </div>   

        <div className={visibleContainers['4'] ? style.box_container : style.box_container_close}>



<div className={style.chart_box}>
<div className={style.chart_title_box} onClick={()=>handleBoxClick(4)}>

  <span className={style.chart_box_title}>이달 소비 패턴</span>
  
  <span className={style.spring}></span>     
          {/* <span className={style.close} > ▲</span>   */}
          </div>       
  <LineChart></LineChart>
    {/* 해설상자 */}
    <div className={style.text_box}>
           
           <p >이번달 사용량은 120kw 입니다. 이는 매달 평균 사용량 356kw의 56%에 해당합니다. </p>     
           <p>또한 현재까지의 요금은 약 12500원 이며, 이 패턴의 소비가 계속 되었을때 NGO가 평가한</p>     
           <p> 이달 예상 총 사용량은 542kw, 요금은 12344원입니다.</p>
           </div>
</div>
</div>
        <div className={style.keyword_box} onClick={()=>handleBoxClick(5)}>
          <h1>4kW</h1>
          <span>하루 평균 사용량</span>
          <span className={style.open}> {visibleContainers['5'] ? '▲' :'▼'}</span>

        </div>


        <div className={visibleContainers['5'] ? style.box_container : style.box_container_close}>


        <div className={style.chart_box}>
<div className={style.chart_title_box} onClick={()=>handleBoxClick(5)}>

          <span className={style.chart_box_title}>평균 소비 패턴</span>    
          <span className={style.spring}></span>     
          {/* <span className={style.close} > ▲</span>     */}
        </div>

          <LineChart></LineChart>
            {/* 해설상자 */}
            <div className={style.text_box}>
           
            <p >이번달 사용량은 120kw 입니다. 이는 매달 평균 사용량 356kw의 56%에 해당합니다. </p>     
            <p>또한 현재까지의 요금은 약 12500원 이며, 이 패턴의 소비가 계속 되었을때 NGO가 평가한</p>     
            <p> 이달 예상 총 사용량은 542kw, 요금은 12344원입니다.</p>
            </div>
        </div>
        </div>




        <div className={style.keyword_box} onClick={()=>handleBoxClick(6)}>
          <h1>54%</h1>
          <span>지역주민 대비 사용량</span>
          <span className={style.open}> {visibleContainers['6'] ? '▲' :'▼'}</span>

        </div>
       
      <div className={visibleContainers['6'] ? style.box_container : style.box_container_close}>
       

       <div className={style.chart_box}>
<div className={style.chart_title_box} onClick={()=>handleBoxClick(6)}>

         <span className={style.chart_box_title}>도시인구 대비 비교</span> 
         <span className={style.spring}></span>     
          {/* <span className={style.close} > ▲</span>     */}
        </div>         
         <RadarChart />
           {/* 해설상자 */}
           <div className={style.text_box}>
           
           <p >이번달 사용량은 120kw 입니다. 이는 매달 평균 사용량 356kw의 56%에 해당합니다. </p>     
           <p>또한 현재까지의 요금은 약 12500원 이며, 이 패턴의 소비가 계속 되었을때 NGO가 평가한</p>     
           <p> 이달 예상 총 사용량은 542kw, 요금은 12344원입니다.</p>
           </div>
       </div>

    
     <div className={style.chart_box}>
     <div className={style.chart_title_box} onClick={()=>handleBoxClick(6)}>

          <span className={style.chart_box_title}>비교</span> 
          <span className={style.spring}></span>     
          {/* <span className={style.close} > ▲</span>     */}
        </div>     

           
           <BarChart></BarChart>
             {/* 해설상자 */}
             <div className={style.text_box}>
           
           <p >이번달 사용량은 120kw 입니다. 이는 매달 평균 사용량 356kw의 56%에 해당합니다. </p>     
           <p>또한 현재까지의 요금은 약 12500원 이며, 이 패턴의 소비가 계속 되었을때 NGO가 평가한</p>     
           <p> 이달 예상 총 사용량은 542kw, 요금은 12344원입니다.</p>
           </div>
           </div>

        </div>


     


      
      



 






      </div>
    </div>
  );
};

export default MyChart;
