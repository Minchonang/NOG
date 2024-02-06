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

  const [userData, setUserData] = useState([]);
  const [graphImage, setGraphImage] = useState('');
  const [mapHtml, setMapHtml] = useState('');
  const [chartHtml, setChartHtml] = useState('');
  const [fee, setFee] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/myHome/test5`);
        setUserData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // axios로 GET 요청 보내기
        const response = await axios.get('http://127.0.0.1:5001/test2');
        
        // 응답에서 데이터 추출하고 상태 업데이트
        const data = response.data;
        setUserData(data)
        // setMapHtml(data.map_html);
        // setChartHtml(data.chart_html);

        // console.log(data);
        // console.log(data.map_html);
          
      
        console.log(data);
      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    };
    fetchData();
  }, []);

  function calculate_bill(usage){
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
          <h1> USER01님의 패턴분석 ♪</h1>
          <span>광주광역시 광산구</span>
        </div>

        <div className={style.keyword_box} onClick={()=>handleBoxClick(1)}>
          <h1>120kw </h1>
          <span>이달 사용 전력</span>

          <h1>23,500원</h1>
          <span>사용요금</span>

          <h1>500원</h1>
          <span>직전달 대비 절약 금액</span>
          <span className={style.open}> {visibleContainers['1'] ? '▲' :'▼'} </span>
        </div>
        {/*도넛 차트 박스  */}
        <div className={visibleContainers['1'] ? style.box_container : style.box_container_close}>
         <div className={style.chart_box}>
            {/* 도넛 제목 박스 */}
            <div className={style.chart_title_box} onClick={()=>handleBoxClick(1)}>
              <h1 className={style.chart_box_title}>이달 소비 전력량(kW) </h1>
              <span className={style.spring}></span>          
              {/* <span className={style.close} > ▲</span> */}
            </div>
             <DoughnutChart data={[userData["average_total_usage"], userData["my_total_usage"]]}/>
            
            <div >
      {/* {graphImage && <img src={`data:image/png;base64,${graphImage}`} alt="Graph" />} */}
      {/* <div dangerouslySetInnerHTML={{ __html: mapHtml }} /> */}
      {/* <div dangerouslySetInnerHTML={{ __html: chartHtml }} />*/}
      {/* {chartHtml && <div dangerouslySetInnerHTML={{ __html: chartHtml }} />} */}

       {/* {chartHtml && <Plot data={JSON.parse(chartHtml).data}  layout={JSON.parse(chartHtml).layout} />} */}
    </div>
            {/* 해설상자 */}
            <div className={style.text_box}>
           
            <p >이번달 사용량은 {userData["average_total_usage"]}kw 입니다. 이는 전달 평균 사용량 {userData["my_total_usage"]}kw의 {userData["average_total_usage"]/userData["my_total_usage"] *100}% 에 해당합니다. </p>     
            <p>또한 현재까지의 요금은 약 {calculate_bill(userData["average_total_usage"])}원 이며, 이 패턴의 소비가 계속 되었을때 NGO가 평가한</p>     
            <p> 이달 예상 총 사용량은 542kw, 요금은 12344원입니다.</p>
            </div>

        </div>
       
        
        </div>
        


        <div className={style.keyword_box} onClick={()=>handleBoxClick(2)}>
          <h1> 오후 소비형</h1>
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

          <PieChart />
            {/* 해설상자 */}
            <div className={style.text_box}>
           
            <p >이번달 사용량은 120kw 입니다. 이는 매달 평균 사용량 356kw의 56%에 해당합니다. </p>     
            <p>또한 현재까지의 요금은 약 12500원 이며, 이 패턴의 소비가 계속 되었을때 NGO가 평가한</p>     
            <p> 이달 예상 총 사용량은 542kw, 요금은 12344원입니다.</p>
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
