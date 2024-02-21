import { React, useEffect, useState } from 'react';
import style from './css/MyChart.module.css';
import axios from 'axios';
import 'chart.js/auto';
import RadarChart from './RadarChart';
import PieChart from './PieChart';
import LineChart from './LineChart';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';
import BarChartDay from './BarChartDay';
import BarChartMonth from './BarChartMonth';
import Header from '../../common/jsx/Header';
import ChatBot from '../../common/jsx/ChatBot';
import BottomNav from '../../common/jsx/BottomNav';
import LoadingNog from '../../common/jsx/LoadingNog';

const MyChart = () => {
   // 키워드 배너를 눌렀는지 값을 할당
   const [visibleContainers, setVisibleContainers] = useState({});
   // 키워드 박스를 눌렀을 때 해당 키워드 박스에 해당하는 차트 박스를 on/off
   const handleBoxClick = (boxNum) => {
      setVisibleContainers((prevContainers) => ({
         // ...prevContainers,
         [boxNum]: !prevContainers[boxNum],
      }));
   };

   const [period, setPeriod] = useState([]);
   const [chartData1, setChartData1] = useState([]);
   const [chartData2, setChartData2] = useState([]);
   const [chartData3, setChartData3] = useState([]);
   const [chartData4, setChartData4] = useState([]);
   const [user, setUser] = useState({});
   const [searchDate, setSearchDate] = useState('');
   const [load, setLoad] = useState(false);
   const [now, setNow] = useState(false);
   const [nowTimeZone, setNowTimeZone] = useState(new Date().getHours());
   const [predData, setPredData] = useState('');

   useEffect(() => {
      //  현시점 날짜 계산
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1; // 월은 0부터 시작하므로 +1
      setNow(year + '-' + month);
   }, []);

   useEffect(() => {
      // sessionStorage.setItem("userId", "testId50");
      const id = sessionStorage.getItem('user_id');

      const fetchData = async () => {
         if (load === true) {
            setLoad(false);
         }

         try {
            // axios로 GET 요청 보내기
            const response = await axios.get(
               `http://3.38.50.14:5000/my_home?user_id=${id}${searchDate ? '&date=' + searchDate : ''}`
            );

            // 응답에서 데이터 추출하고 상태 업데이트
            const data = response.data;
            setChartData1(data.data1);
            setChartData2(data.data2);
            setChartData3(data.data3);
            setChartData4(data.data4);
            setPeriod(data.data0);
            setUser({
               user_id: id,
               user_name: data.data2['user_name'],
               user_city: data.data2['city_name'],
            });
            setNowTimeZone(new Date().getHours());
            console.log(data);
            console.log(id);
         } catch (error) {
            console.error('Error fetching graph data:', error);
         } finally {
            setLoad(true);
         }
      };
      fetchData();
   }, [searchDate]);

   useEffect(() => {
      const fetchPredData = async () => {
         const id = sessionStorage.getItem('user_id');

         try {
            // axios로 GET 요청 보내기
            const response = await axios.get(`http://3.38.50.14:5000/pred?user_id=${id}`);
            const data = response.data;
            console.log('pred_result : ', data);
            setPredData({
               total: data['total'],
               total_bill: data['total_bill'],
            });
         } catch (error) {
            console.error('Error fetching graph data:', error);
         } finally {
            setLoad(true);
         }
      };

      if (load === true) {
         if (searchDate === '' || searchDate === now) {
            if (predData === '') {
               fetchPredData();
            }
         }
      }
   }, [load]);

   // 증감율 계산
   const caculatePercent = (A, B) => {
      if (B === 0) {
         return 0;
      }
      let result = Math.round((((A - B) / B) * 1000) / 10);
      if (result >= 0) {
         result = '+' + result;
      }
      return result;
   };

   const calculateTimeZone = (input_hour) => {
      const usage_5_11 = [5, 6, 7, 8, 9, 10];
      const usage_11_17 = [11, 12, 13, 14, 15, 16];
      const usage_17_23 = [17, 18, 19, 20, 21, 22];
      const usage_23_5 = [23, 0, 24, 1, 2, 3, 4];

      if (usage_5_11.includes(input_hour)) {
         return ['usage_5_10', '(05:00-11:00)'];
      } else if (usage_11_17.includes(input_hour)) {
         return ['usage_11_16', '(11:00-17:00)'];
      } else if (usage_17_23.includes(input_hour)) {
         return ['usage_17_22', '(17:00-23:00)'];
      } else if (usage_23_5.includes(input_hour)) {
         return ['usage_23_4', '(23:00-5:00)'];
      } else {
         return '';
      }
   };

   // 날짜를 선택할때 마다 불러오기
   const searchDateHandler = (event) => {
      if (event.target.value === '') {
         return false;
      }

      setSearchDate(event.target.value);
   };

   function scrollToTop() {
      window.scrollTo({
         top: 0,
         behavior: 'smooth', // 부드럽게 스크롤되도록 설정
      });
   }
   return (
      <>
         {load === false ? (
            <LoadingNog />
         ) : (
            <>
               <div className={style.body}>
                  <Header sub_title="소비 리포트" userId={user && user['user_id'] ? user['user_id'] : null} />

                  <div className={style.container}>
                     <div className={style.title}>
                        <h1>
                           {(searchDate ? searchDate : now).substr(-2) < 10
                              ? (searchDate ? searchDate : now).substr(-1)
                              : (searchDate ? searchDate : now).substr(-2)}
                           월 전력 소비 리포트
                        </h1>
                        <div className={style.period_box}>
                           <span className={style.spring}></span>

                           <select onChange={searchDateHandler} value={searchDate}>
                              <option value="">조회기간</option>
                              {Object.keys(period).map((key, index) => (
                                 <option key={index} value={period[key]}>
                                    {period[key]}
                                 </option>
                              ))}
                           </select>
                        </div>
                     </div>

                     {/* ---------------------------------------------------------------------------------- */}
                     {/* 첫번째 박스 - 이번달 예상 전기 요금 */}
                     <div
                        className={`${style.keyword_box} ${style.bill_box} ${
                           visibleContainers['1'] ? style.keyword_box_open : ''
                        }`}
                        onClick={() => handleBoxClick(1)}
                     >
                        <div>
                           {searchDate !== '' && searchDate !== now ? (
                              <span>이번 달 전기 요금</span>
                           ) : (
                              <span>이번 달 예상 전기 요금</span>
                           )}
                        </div>

                        <div>
                           {searchDate !== '' && searchDate !== now ? (
                              <h1>
                                 {chartData1['my_this_month_bill']
                                    ? chartData1['my_this_month_bill'].toLocaleString('ko-KR')
                                    : '데이터 없음'}{' '}
                                 원
                              </h1>
                           ) : (
                              <h1>
                                 {predData && predData['total_bill']
                                    ? predData['total_bill'].toLocaleString('ko-KR') + '원'
                                    : '예측 진행중..'}
                              </h1>
                           )}
                        </div>

                        <span className={style.open}>{visibleContainers['1'] ? '닫기' : '상세보기'}</span>
                     </div>

                     {/*첫번째 박스 상세보기 - 도넛 차트 박스  */}
                     <div className={visibleContainers['1'] ? style.box_container : style.box_container_close}>
                        <div className={style.chart_box}>
                           {/* 첫번째 박스 상세보기 제목 */}
                           <div className={style.chart_title_box} onClick={() => handleBoxClick(1)}>
                              <h1 className={style.chart_box_title}>이번 달 소비 전력량 </h1>
                              <span className={style.spring}></span>
                              <span className={style.close}> ●</span>
                           </div>

                           <DoughnutChart
                              data1={[
                                 chartData1['average_total_usage'],
                                 chartData1['my_total_usage'],

                                 Math.round((chartData1['my_total_usage'] / chartData1['average_total_usage']) * 1000) /
                                    10,
                              ]}
                           />

                           {/* 첫번째 박스 해설상자 */}
                           <div className={style.text_box}>
                              <p>이번 달 현재까지와 저번 달, 지역 평균의 전력 사용량의 비교입니다.</p>

                              <table className={style.custom_table}>
                                 <thead>
                                    <tr>
                                       <th></th>
                                       <th>이번 달</th>
                                       <th>저번 달</th>
                                       <th>지역평균</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    <tr>
                                       <th className={style.border_right}>사용량</th>
                                       <td className={style.border_right}>
                                          {chartData1['my_total_usage'] ? chartData1['my_total_usage'] : 0} kWh
                                       </td>
                                       <td className={style.border_right}>{chartData1['my_total_usage_last']} kWh</td>
                                       <td>{chartData1['average_total_usage']} kWh</td>
                                    </tr>
                                    <tr>
                                       <th className={style.border_right}>요금</th>
                                       <td className={style.border_right}>
                                          {chartData1['my_this_month_bill']
                                             ? chartData1['my_this_month_bill'].toLocaleString('ko-KR')
                                             : '데이터 없음'}{' '}
                                          원
                                       </td>
                                       <td className={style.border_right}>
                                          {chartData1['my_before_month_bill']
                                             ? chartData1['my_before_month_bill'].toLocaleString('ko-KR')
                                             : '데이터 없음'}{' '}
                                          원
                                       </td>
                                       <td>
                                          {chartData1['city_before_month_bill']
                                             ? chartData1['city_before_month_bill'].toLocaleString('ko-KR')
                                             : '데이터 없음'}{' '}
                                          원
                                       </td>
                                    </tr>
                                 </tbody>
                              </table>
                              {(now === searchDate || searchDate === '') && predData['total'] ? (
                                 <>
                                    <p className={style.pred_text}>
                                       NOG가 평가한 이번 달 예상 총 사용량은
                                       <span className={style.important_keywords}>
                                          {predData['total'] ? predData['total'] : 0}kwh
                                       </span>
                                       , 요금은{' '}
                                       <span className={style.important_keywords}>
                                          {predData['total_bill'] ? predData['total_bill'].toLocaleString('ko-KR') : 0}
                                          원
                                       </span>
                                       입니다.
                                    </p>
                                 </>
                              ) : null}
                           </div>
                           <div className={style.bottom_close} onClick={() => handleBoxClick(1)}>
                              ▲
                           </div>
                        </div>
                     </div>

                     {/* ---------------------------------------------------------------------------------- */}
                     {/* 두번째 박스 - 전력 소비 유형 */}
                     <div
                        className={`${style.keyword_box} ${style.type_box}
                  ${visibleContainers['2'] ? style.keyword_box_open : ''}`}
                        onClick={() => handleBoxClick(2)}
                     >
                        <div>
                           <span>전력 소비 유형</span>

                           <span>
                              {chartData2['user_type'] ? (
                                 <>
                                    <span className={style.important_keywords}>{chartData2['user_type']}</span>
                                    <span>{' (' + chartData2['usage_timezone'] + ')'}</span>
                                 </>
                              ) : (
                                 <span>데이터 없음</span>
                              )}
                           </span>
                        </div>
                        <div>
                           <span>전체 시간대 비율</span>
                           <h1>
                              {chartData2['usage_percentage'][chartData2['user_type']]
                                 ? chartData2['usage_percentage'][chartData2['user_type']]
                                 : 0}
                              %
                           </h1>
                        </div>

                        <span className={style.open}>{visibleContainers['2'] ? '닫기' : '상세보기'}</span>
                     </div>

                     {/*두번째 박스 상세보기 - 파이 차트 박스  */}
                     <div className={visibleContainers['2'] ? style.box_container : style.box_container_close}>
                        <div className={style.chart_box}>
                           <div className={style.chart_title_box} onClick={() => handleBoxClick(2)}>
                              {/* 두번째 박스 상세보기 제목 */}
                              <span className={style.chart_box_title}>소비 유형 </span>
                              <span className={style.spring}></span>
                              <span className={style.close}> ●</span>
                           </div>

                           <PieChart chart_Data2={chartData2['usage_percentage'] && chartData2['usage_percentage']} />
                           {/* 두번째 박스 해설상자 */}
                           <div className={style.text_box}>
                              <p>이번 달 전력 소비 시간대 별 전력 소비량 비교 입니다.</p>

                              <table className={style.custom_table}>
                                 <thead>
                                    <tr>
                                       <th></th>
                                       <th>사용량</th>
                                       <th>사용비율</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    <tr>
                                       <th className={style.border_right}>오전(05~11시)</th>
                                       <td className={style.border_right}>
                                          {chartData2 && chartData2['my_usage'] && chartData2['my_usage']['usage_5_10']
                                             ? chartData2['my_usage']['usage_5_10']
                                             : 0}{' '}
                                          kWh
                                       </td>
                                       <td>
                                          {chartData2['usage_percentage']
                                             ? chartData2['usage_percentage']['오전'] + ' %'
                                             : '데이터 없음'}
                                       </td>
                                    </tr>
                                    <tr>
                                       <th className={style.border_right}>오후(11~17시)</th>
                                       <td className={style.border_right}>
                                          {chartData2 && chartData2['my_usage'] && chartData2['my_usage']['usage_11_16']
                                             ? chartData2['my_usage']['usage_11_16']
                                             : 0}{' '}
                                          kWh
                                       </td>
                                       <td>
                                          {chartData2['usage_percentage']
                                             ? chartData2['usage_percentage']['오후'] + ' %'
                                             : '데이터 없음'}
                                       </td>
                                    </tr>
                                    <tr>
                                       <th className={style.border_right}>저녁(17~23시)</th>
                                       <td className={style.border_right}>
                                          {chartData2 && chartData2['my_usage'] && chartData2['my_usage']['usage_17_22']
                                             ? chartData2['my_usage']['usage_17_22']
                                             : 0}{' '}
                                          kWh
                                       </td>
                                       <td>
                                          {chartData2['usage_percentage']
                                             ? chartData2['usage_percentage']['저녁'] + ' %'
                                             : '데이터 없음'}
                                       </td>
                                    </tr>
                                    <tr>
                                       <th className={style.border_right}>심야,새벽(23~05시)</th>
                                       <td className={style.border_right}>
                                          {chartData2 && chartData2['my_usage'] && chartData2['my_usage']['usage_23_4']
                                             ? chartData2['my_usage']['usage_23_4']
                                             : 0}{' '}
                                          kWh
                                       </td>
                                       <td>
                                          {chartData2['usage_percentage']
                                             ? chartData2['usage_percentage']['심야,새벽'] + ' %'
                                             : '데이터 없음'}
                                       </td>
                                    </tr>
                                 </tbody>
                              </table>
                              <p className={style.pred_text}>
                                 시간별 전력 소비량을 합산한 결과, NOG가 평가한 회원님의 소비 유형은{' '}
                                 <span className={style.important_keywords}>
                                    '{chartData2['user_type'] ? chartData2['user_type'] : '오전'}'
                                 </span>
                                 소비형입니다.
                              </p>
                           </div>
                           <div className={style.bottom_close} onClick={() => handleBoxClick(2)}>
                              ▲
                           </div>
                        </div>
                     </div>

                     {/* ---------------------------------------------------------------------------------- */}
                     {/* 세번째 박스 - 이번 달 사용량 */}
                     <div
                        className={`${style.keyword_box} 
                  ${visibleContainers['7'] ? style.keyword_box_open : ''}`}
                        onClick={() => handleBoxClick(7)}
                     >
                        <div>
                           <span>이번 달 사용량</span>
                           <span className={style.important_keywords}>
                              {chartData1['my_total_usage'] ? chartData1['my_total_usage'] + ' kWh' : '데이터 없음'}
                           </span>
                        </div>
                        <div>
                           <span>{chartData2['city_name'] ? chartData2['city_name'] + '의' : '같은 지역의'}</span>

                           {chartData1['my_total_usage'] ? (
                              caculatePercent(chartData1['my_total_usage'], chartData4['city_average_daily_usage']) >
                              0 ? (
                                 <h1 className={style.plus_text}>
                                    {caculatePercent(
                                       chartData1['my_total_usage'],
                                       chartData4['city_average_daily_usage']
                                    ) + '%'}
                                 </h1>
                              ) : (
                                 <h1 className={style.minus_text}>
                                    {caculatePercent(
                                       chartData1['my_total_usage'],
                                       chartData4['city_average_daily_usage']
                                    ) + '%'}
                                 </h1>
                              )
                           ) : (
                              <h1>데이터 없음</h1>
                           )}
                        </div>

                        <span className={style.open}>{visibleContainers['7'] ? '닫기' : '상세보기'}</span>
                     </div>
                     {/*세번째 박스 상세보기 - 바차트 박스  */}
                     <div className={visibleContainers['7'] ? style.box_container : style.box_container_close}>
                        <div className={style.chart_box}>
                           <div className={style.chart_title_box} onClick={() => handleBoxClick(7)}>
                              {/* 세번째 박스 상세보기 제목 */}
                              <span className={style.chart_box_title}>월간 비교</span>
                              <span className={style.spring}></span>
                              <span className={style.close}> ●</span>
                           </div>

                           <BarChart data6={[chartData1, chartData4]}></BarChart>
                           {/* 세번째 박스 해설상자 */}
                           <div className={style.text_box}>
                              <p>
                                 회원님과 {user['user_city'] ? user['user_city'] : '같은 지역'}의 이번 달, 지난달,
                                 전년동월의 전력소모량 비교 입니다.
                              </p>
                              <table className={style.custom_table}>
                                 <thead>
                                    <tr>
                                       <th></th>
                                       <th>{user['user_name']}님</th>
                                       <th>지역평균</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    <tr>
                                       <th className={style.border_right}>이번 달</th>
                                       <td className={style.border_right}>
                                          {chartData1['my_total_usage'] ? chartData1['my_total_usage'] : 0} kWh
                                       </td>
                                       <td>{chartData4 ? chartData4['city_average_daily_usage'] : 0} kWh</td>
                                    </tr>
                                    <tr>
                                       <th className={style.border_right}>지난 달</th>
                                       <td className={style.border_right}>
                                          {chartData1['my_total_usage_last'] ? chartData1['my_total_usage_last'] : 0}{' '}
                                          kWh
                                       </td>
                                       <td>
                                          {chartData1['average_total_usage'] ? chartData1['average_total_usage'] : 0}{' '}
                                          kWh
                                       </td>
                                    </tr>
                                    <tr>
                                       <th className={style.border_right}>전년동월</th>
                                       <td className={style.border_right}>
                                          {chartData4 ? chartData4['user_month_total_last_year'] : 0} kWh
                                       </td>
                                       <td> {chartData4 ? chartData4['city_month_total_last_year'] : 0} kWh</td>
                                    </tr>
                                 </tbody>
                              </table>
                           </div>
                           <div className={style.bottom_close} onClick={() => handleBoxClick(7)}>
                              ▲
                           </div>
                        </div>
                     </div>

                     {/* ---------------------------------------------------------------------------------- */}
                     {/* 네번째 박스 - 일 평균 사용량 */}
                     <div
                        className={`${style.keyword_box} 
                  ${visibleContainers['5'] ? style.keyword_box_open : ''}`}
                        onClick={() => handleBoxClick(5)}
                     >
                        <div>
                           <span>일 평균 사용량</span>
                           <span className={style.important_keywords}>
                              {chartData3 && chartData3['average'] && chartData3['average'][0]
                                 ? chartData3['average'][0]
                                 : 0}
                              kW
                           </span>
                        </div>
                        <div>
                           <span>{user['user_city'] ? user['user_city'] + '의' : '같은 지역의'}</span>

                           {chartData3['average'][0] ? (
                              caculatePercent(chartData3['average'][0], chartData3['average'][1]) > 0 ? (
                                 <h1 className={style.plus_text}>
                                    {caculatePercent(chartData3['average'][0], chartData3['average'][1]) + '%'}
                                 </h1>
                              ) : (
                                 <h1 className={style.minus_text}>
                                    {caculatePercent(chartData3['average'][0], chartData3['average'][1]) + '%'}
                                 </h1>
                              )
                           ) : (
                              <h1>데이터 없음</h1>
                           )}
                        </div>

                        <span className={style.open}> {visibleContainers['5'] ? '닫기' : '상세보기'}</span>
                     </div>

                     {/* 네번째 박스 상세보기 - 바차트Day 박스  */}
                     <div className={visibleContainers['5'] ? style.box_container : style.box_container_close}>
                        <div className={style.chart_box}>
                           <div className={style.chart_title_box} onClick={() => handleBoxClick(5)}>
                              {/* 네번째 박스 상세보기 제목 */}
                              <span className={style.chart_box_title}>평균 소비 패턴</span>
                              <span className={style.spring}></span>
                              <span className={style.close}> ●</span>
                           </div>

                           {/* <LineChart></LineChart> */}
                           <BarChartDay
                              data4={chartData3 && chartData3['average'] && chartData3['average']}
                           ></BarChartDay>

                           {/* 네번째 박스 해설상자 */}
                           <div className={style.text_box}>
                              {/* <p>이번달 일일 평균 사용량은 {chartData3["average"][0]}kw 입니다.</p> */}

                              <p>
                                 회원님과 {user['user_city'] ? user['user_city'] : '같은 도시'}의 이번 달 일일 평균 전력
                                 사용량에 대한 비교 입니다.
                              </p>

                              <table className={style.custom_table}>
                                 <thead>
                                    <tr>
                                       <th></th>
                                       <th>{user['user_name']}님</th>
                                       <th>지역평균</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    <tr>
                                       <th className={style.border_right}>평균 소비량</th>
                                       <td className={style.border_right}>
                                          {chartData3 && chartData3['average'] && chartData3['average'][0]
                                             ? chartData3['average'][0] + ' kWh'
                                             : '데이터 없음'}
                                       </td>
                                       <td>
                                          {chartData3 && chartData3['average'] && chartData3['average'][1]
                                             ? chartData3['average'][1] + ' kWh'
                                             : '데이터 없음'}
                                       </td>
                                    </tr>
                                 </tbody>
                              </table>
                           </div>
                           <div className={style.bottom_close} onClick={() => handleBoxClick(5)}>
                              ▲
                           </div>
                        </div>
                     </div>

                     {/* ---------------------------------------------------------------------------------- */}
                     {/* 다섯번째 박스 - 현재 시간대 총 사용량 */}
                     <div
                        className={`${style.keyword_box}  ${style.type_box}
                  ${visibleContainers['6'] ? style.keyword_box_open : ''}`}
                        onClick={() => handleBoxClick(6)}
                     >
                        <div>
                           <span>현재 시간대 총 사용량 </span>

                           <span>
                              {chartData2 && chartData2['my_usage'] ? (
                                 <>
                                    <span className={style.important_keywords}>
                                       {chartData2['my_usage'][calculateTimeZone(nowTimeZone)[0]] + ' kWh '}
                                    </span>
                                    <span>{calculateTimeZone(nowTimeZone)[1]}</span>
                                 </>
                              ) : (
                                 ''
                              )}
                           </span>
                        </div>
                        <div>
                           <span> {user['user_city'] ? user['user_city'] + '의' : '같은 지역의'}</span>
                           {chartData2['my_usage'] ? (
                              caculatePercent(
                                 chartData2['my_usage'][calculateTimeZone(nowTimeZone)[0]],
                                 chartData2['city_usage'][calculateTimeZone(nowTimeZone)[0]]
                              ) > 0 ? (
                                 <h1 className={style.plus_text}>
                                    {caculatePercent(
                                       chartData2['my_usage'][calculateTimeZone(nowTimeZone)[0]],
                                       chartData2['city_usage'][calculateTimeZone(nowTimeZone)[0]]
                                    ) + '%'}
                                 </h1>
                              ) : (
                                 <h1 className={style.minus_text}>
                                    {caculatePercent(
                                       chartData2['my_usage'][calculateTimeZone(nowTimeZone)[0]],
                                       chartData2['city_usage'][calculateTimeZone(nowTimeZone)[0]]
                                    ) + '%'}
                                 </h1>
                              )
                           ) : (
                              ''
                           )}
                        </div>

                        <span className={style.open}>{visibleContainers['6'] ? '닫기' : '상세보기'}</span>
                     </div>

                     {/*다섯번째 박스 상세보기 - 레이더차트 박스  */}
                     <div className={visibleContainers['6'] ? style.box_container : style.box_container_close}>
                        <div className={style.chart_box}>
                           <div className={style.chart_title_box} onClick={() => handleBoxClick(6)}>
                              {/* 다섯번째 박스 상세보기 제목 */}
                              <span className={style.chart_box_title}>도시인구 대비 비교</span>
                              <span className={style.spring}></span>
                              <span className={style.close}> ●</span>
                           </div>
                           <RadarChart data5={[chartData2['city_usage'], chartData2['my_usage']]} />

                           {/* 다섯번째 박스 해설상자 */}
                           <div className={style.text_box}>
                              <p>
                                 회원님의 이번 달 시간대 별 사용량과{' '}
                                 {user['user_city'] ? user['user_city'] : '같은 도시'}의 지난 달 시간대 별 평균
                                 사용량과의 비교 입니다.
                              </p>
                              <table className={style.custom_table}>
                                 <thead>
                                    <tr>
                                       <th>시간대</th>
                                       <th>{user['user_name']}님</th>
                                       <th>지역평균</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    <tr>
                                       <th className={style.border_right}>오전(05-11시)</th>
                                       <td className={style.border_right}>
                                          {chartData2 && chartData2['my_usage'] && chartData2['my_usage']['usage_5_10']
                                             ? chartData2['my_usage']['usage_5_10']
                                             : 0}{' '}
                                          kWh
                                       </td>
                                       <td>
                                          {chartData2 &&
                                          chartData2['city_usage'] &&
                                          chartData2['city_usage']['usage_5_10']
                                             ? chartData2['city_usage']['usage_5_10']
                                             : 0}{' '}
                                          kWh
                                       </td>
                                    </tr>
                                    <tr>
                                       <th className={style.border_right}>오후(11-17시)</th>
                                       <td className={style.border_right}>
                                          {chartData2 && chartData2['my_usage'] && chartData2['my_usage']['usage_11_16']
                                             ? chartData2['my_usage']['usage_11_16']
                                             : 0}{' '}
                                          kWh
                                       </td>
                                       <td>
                                          {chartData2 &&
                                          chartData2['city_usage'] &&
                                          chartData2['city_usage']['usage_11_16']
                                             ? chartData2['city_usage']['usage_11_16']
                                             : 0}{' '}
                                          kWh
                                       </td>
                                    </tr>
                                    <tr>
                                       <th className={style.border_right}>저녁(17-23시)</th>
                                       <td className={style.border_right}>
                                          {chartData2 && chartData2['my_usage'] && chartData2['my_usage']['usage_17_22']
                                             ? chartData2['my_usage']['usage_17_22']
                                             : 0}{' '}
                                          kWh
                                       </td>
                                       <td>
                                          {chartData2 &&
                                          chartData2['city_usage'] &&
                                          chartData2['city_usage']['usage_17_22']
                                             ? chartData2['city_usage']['usage_17_22']
                                             : 0}{' '}
                                          kWh
                                       </td>
                                    </tr>
                                    <tr>
                                       <th className={style.border_right}>심야,새벽(23-05시)</th>
                                       <td className={style.border_right}>
                                          {chartData2 && chartData2['my_usage'] && chartData2['my_usage']['usage_23_4']
                                             ? chartData2['my_usage']['usage_23_4']
                                             : 0}{' '}
                                          kWh
                                       </td>
                                       <td>
                                          {chartData2 &&
                                          chartData2['city_usage'] &&
                                          chartData2['city_usage']['usage_23_4']
                                             ? chartData2['city_usage']['usage_23_4']
                                             : 0}{' '}
                                          kWh
                                       </td>
                                    </tr>
                                 </tbody>
                              </table>
                           </div>
                           <div className={style.bottom_close} onClick={() => handleBoxClick(6)}>
                              ▲
                           </div>
                        </div>
                     </div>

                     {/* ---------------------------------------------------------------------------------- */}
                     {/* 여섯번째 박스 - 최대 전력 소비일 */}
                     <div
                        className={`${style.keyword_box} 
                  ${visibleContainers['4'] ? style.keyword_box_open : ''}`}
                        onClick={() => handleBoxClick(4)}
                     >
                        <div>
                           <span>최대 전력 소비 일</span>
                           <span className={style.important_keywords}>
                              {chartData3 && chartData3['max_month'] && chartData3['max_month'][0]
                                 ? chartData3['max_month'][0]
                                 : 1}
                              일
                           </span>
                        </div>
                        <div>
                           <span>일 평균 대비</span>

                           {chartData3 && chartData3['average'] ? (
                              caculatePercent(chartData3['max_month'][2], chartData3['average'][0]) > 0 ? (
                                 <h1 className={style.plus_text}>
                                    {caculatePercent(chartData3['max_month'][2], chartData3['average'][0]) + '%'}
                                 </h1>
                              ) : (
                                 <h1 className={style.minus_text}>
                                    {caculatePercent(chartData3['max_month'][2], chartData3['average'][0]) + '%'}
                                 </h1>
                              )
                           ) : (
                              <h1>데이터 없음</h1>
                           )}
                        </div>

                        <span className={style.open}> {visibleContainers['4'] ? '닫기' : '상세보기'}</span>
                     </div>

                     {/*여섯번째 박스 상세보기 - 바차트Month 박스  */}
                     <div className={visibleContainers['4'] ? style.box_container : style.box_container_close}>
                        <div className={style.chart_box}>
                           <div className={style.chart_title_box} onClick={() => handleBoxClick(4)}>
                              {/* 여섯번째 박스 상세보기 제목 */}
                              <span className={style.chart_box_title}>이번 달 소비 패턴</span>

                              <span className={style.spring}></span>
                              <span className={style.close}> ●</span>
                           </div>
                           <BarChartMonth
                              data5={
                                 chartData3 &&
                                 chartData3['my_month_use'] && [
                                    chartData3['my_month_use'],
                                    chartData3 && chartData3['city_month_use'] && chartData3['city_month_use'],
                                 ]
                              }
                           ></BarChartMonth>
                           {/* 여섯번째 박스 해설상자 */}
                           <div className={style.text_box}>
                              <p>
                                 회원님과 {user['user_city'] ? user['user_city'] : '같은 도시'}의 일일 전력 사용량에
                                 대한 비교 입니다.
                              </p>
                              <table className={style.custom_table}>
                                 <thead>
                                    <tr>
                                       <th></th>
                                       <th>{user['user_name']}님</th>
                                       <th>지역평균</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    <tr>
                                       <th rowSpan={2} className={style.border_right}>
                                          최대 전력 소비(일)
                                       </th>
                                       <td className={style.border_right}>
                                          {chartData3['max_month']
                                             ? chartData3['max_month'][0] + ' 일 '
                                             : '데이터 없음'}
                                       </td>
                                       <td>
                                          {chartData3['max_month']
                                             ? chartData3['max_month'][1] + ' 일 '
                                             : '데이터 없음'}
                                       </td>
                                    </tr>
                                    <tr>
                                       <td className={style.border_right}>
                                          {chartData3['max_month'] ? chartData3['max_month'][2] + ' kWh' : ''}
                                       </td>
                                       <td>{chartData3['max_month'] ? chartData3['max_month'][3] + ' kWh' : ''}</td>
                                    </tr>
                                    <tr>
                                       <th rowSpan={2} className={`${style.border_bottom} ${style.border_right}`}>
                                          최저 전력 소비(일)
                                       </th>
                                       <td className={`${style.border_bottom} ${style.border_right}`}>
                                          {chartData3['min_month']
                                             ? chartData3['min_month'][0] + ' 일 '
                                             : '데이터 없음'}
                                       </td>
                                       <td className={style.border_bottom}>
                                          {chartData3['min_month']
                                             ? chartData3['min_month'][1] + ' 일 '
                                             : '데이터 없음'}
                                       </td>
                                    </tr>
                                    <tr>
                                       <td className={style.border_right}>
                                          {chartData3['min_month'] ? chartData3['min_month'][2] + ' kWh' : ''}
                                       </td>
                                       <td>{chartData3['min_month'] ? chartData3['min_month'][3] + ' kWh' : ''}</td>
                                    </tr>
                                 </tbody>
                              </table>
                           </div>
                           <div className={style.bottom_close} onClick={() => handleBoxClick(4)}>
                              ▲
                           </div>
                        </div>
                     </div>

                     {/* ---------------------------------------------------------------------------------- */}
                     {/* 일곱번째 박스 - 최대 전력 소비일 */}
                     <div
                        className={`${style.keyword_box} 
                  ${visibleContainers['3'] ? style.keyword_box_open : ''}`}
                        onClick={() => handleBoxClick(3)}
                     >
                        <div>
                           <span>최대 전력 소비 요일</span>
                           <span className={style.important_keywords}>
                              {chartData3['max_day'] ? chartData3['max_day'][0] : '데이터 없음'}
                           </span>
                        </div>
                        <div>
                           <span>일 평균 대비</span>

                           {chartData3['max_day'] ? (
                              caculatePercent(chartData3['max_day'][2], chartData3['average'][0]) > 0 ? (
                                 <h1 className={style.plus_text}>
                                    {caculatePercent(chartData3['max_day'][2], chartData3['average'][0]) + '%'}
                                 </h1>
                              ) : (
                                 <h1 className={style.minus_text}>
                                    {caculatePercent(chartData3['max_day'][2], chartData3['average'][0]) + '%'}
                                 </h1>
                              )
                           ) : (
                              '데이터 없음'
                           )}
                        </div>

                        <span className={style.open}> {visibleContainers['3'] ? '닫기' : '상세보기'}</span>
                     </div>

                     {/* 일곱번째 박스 상세보기 - 라인차트 박스  */}
                     <div className={visibleContainers['3'] ? style.box_container : style.box_container_close}>
                        <div className={style.chart_box}>
                           <div className={style.chart_title_box} onClick={() => handleBoxClick(3)}>
                              {/* 일곱번째 박스 상세보기 제목 */}
                              <span className={style.chart_box_title}>요일별 소비 패턴</span>
                              <span className={style.spring}></span>
                              <span className={style.close}> ●</span>
                           </div>
                           <LineChart data3={chartData3}></LineChart>
                           {/* 일곱번째 박스 해설상자 */}
                           <div className={style.text_box}>
                              <p>
                                 회원님과 {user['user_city'] ? user['user_city'] : '같은 도시'}의 요일 별 평균 사용량
                                 비교입니다.
                              </p>
                              <table className={style.custom_table}>
                                 <thead>
                                    <tr>
                                       <th></th>
                                       <th>{user['user_name']}님</th>
                                       <th>지역평균</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    <tr>
                                       <th rowSpan={2} className={style.border_right}>
                                          최대 전력 소비(요일)
                                       </th>
                                       <td className={style.border_right}>
                                          {chartData3['max_day'] ? chartData3['max_day'][0] : '데이터 없음'}
                                       </td>
                                       <td>{chartData3['max_day'] ? chartData3['max_day'][1] : '데이터 없음'}</td>
                                    </tr>
                                    <tr>
                                       {/* <th>최대 요일 소비량</th> */}
                                       <td className={style.border_right}>
                                          {chartData3['max_day'] ? Math.round(chartData3['max_day'][2]) : 0} kWh
                                       </td>
                                       <td>{chartData3['max_day'] ? Math.round(chartData3['max_day'][3]) : 0} kWh</td>
                                    </tr>
                                    <tr>
                                       <th rowSpan={2} className={`${style.border_bottom} ${style.border_right}`}>
                                          최저 전력 소비(요일)
                                       </th>
                                       <td className={`${style.border_bottom} ${style.border_right}`}>
                                          {chartData3['min_day'] ? chartData3['min_day'][0] : '데이터 없음'}{' '}
                                       </td>
                                       <td className={style.border_bottom}>
                                          {chartData3['min_day'] ? chartData3['min_day'][1] : '데이터 없음'}{' '}
                                       </td>
                                    </tr>
                                    <tr>
                                       {/* <th>최저 요일 소비량</th> */}
                                       <td className={style.border_right}>
                                          {chartData3['min_day'] ? Math.round(chartData3['min_day'][2]) : 0} kWh
                                       </td>
                                       <td>{chartData3['min_day'] ? Math.round(chartData3['min_day'][3]) : 0} kWh</td>
                                    </tr>
                                 </tbody>
                              </table>
                           </div>
                           <div className={style.bottom_close} onClick={() => handleBoxClick(3)}>
                              ▲
                           </div>
                        </div>
                     </div>
                     <div
                        onClick={() => {
                           scrollToTop();
                           setVisibleContainers('');
                        }}
                        className={style.keyword_box}
                     >
                        <span> ▲ top</span>
                     </div>
                  </div>
                  <ChatBot />
                  <BottomNav activeData={true} />
               </div>
            </>
         )}
      </>
   );
};

export default MyChart;
