import { React, useEffect, useState } from "react";
import style from "./css/MyChart.module.css";
import axios from "axios";
import "chart.js/auto";
import RadarChart from "./RadarChart";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";
import BarChartDay from "./BarChartDay";
import BarChartMonth from "./BarChartMonth";
import Header from "../../common/jsx/Header";
import ChatBot from "../../common/jsx/ChatBot";
import BottomNav from "../../common/jsx/BottomNav";
import LoadingNog from "../../common/jsx/LoadingNog";

const MyChart = () => {
  // 키워드 배너를 눌렀는지 값을 할당
  const [visibleContainers, setVisibleContainers] = useState({});
  // 키워드 박스를 눌렀을 때 해당 키워드 박스에 해당하는 차트 박스를 on/off
  const handleBoxClick = (boxNum) => {
    setVisibleContainers((prevContainers) => ({
      ...prevContainers,
      [boxNum]: !prevContainers[boxNum],
    }));
  };

  const [period, setPeriod] = useState([]);
  const [chartData1, setChartData1] = useState([]);
  const [chartData2, setChartData2] = useState([]);
  const [chartData3, setChartData3] = useState([]);
  const [chartData4, setChartData4] = useState([]);
  const [user, setUser] = useState({});
  const [searchDate, setSearchDate] = useState("");
  const [load, setLoad] = useState(false);
  const [now, setNow] = useState(false);
  const [predData, setPredData] = useState("");

  useEffect(() => {
    //  현시점 날짜 계산
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month =
      currentDate.getMonth() + 1 < 10
        ? "0" + (currentDate.getMonth() + 1)
        : currentDate.getMonth() + 1; // 월은 0부터 시작하므로 +1
    setNow(year + "-" + month);
  }, []);

  useEffect(() => {
    // sessionStorage.setItem("userId", "testId50");
    const id = sessionStorage.getItem("user_id");

    const fetchData = async () => {
      if (load == true) {
        setLoad(false);
      }

      try {
        // axios로 GET 요청 보내기
        const response = await axios.get(
          `http://192.168.0.84:5001/my_home?user_id=${id}${
            searchDate ? "&date=" + searchDate : ""
          }`
        );

        // 응답에서 데이터 추출하고 상태 업데이트
        const data = response.data;
        setChartData1(data.data1);
        setChartData2(data.data2);
        setChartData3(data.data3);
        setChartData4(data.data4);
        setPeriod(data.data0);
        setPredData({
          total: data["total"],
          total_bill: data["total_bill"],
        });
        setUser({
          user_id: id,
          user_name: data.data2["user_name"],
          user_city: data.data2["city_name"],
        });
        console.log(data);
        console.log(id);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      } finally {
        setLoad(true);
      }
    };
    fetchData();
  }, [searchDate]);

  // // 회원 정보로 검색 완료된 후 예측
  // useEffect(() => {
  //   const fetchPred = async () => {
  //     try {
  //       // axios로 GET 요청 보내기
  //       const response = await axios.get(
  //         `http://192.168.0.84:5001/pred?user_id=${user["user_id"]}`
  //       );

  //       // 응답에서 데이터 추출하고 상태 업데이트
  //       const data = response.data;
  //       console.log("data2", data);
  //       setPredData({
  //         total: data["total"],
  //         total_bill: data["total_bill"],
  //       });
  //     } catch (error) {
  //       console.error("Error fetching graph data:", error);
  //     } finally {
  //     }
  //   };
  //   // 로딩이 완료된 후
  //   if (period.length > 0) {
  //     // 사용한 기간이 있다면 예측
  //     // 초기 로딩시 선택된 셀렉트 값이 없거나 이후 현재 시점을 다시 클릭한 경우
  //     if (searchDate === "" || searchDate === now) {
  //       fetchPred();
  //     }
  //   }
  // }, [period]);

  // 날짜를 선택할때 마다 불러오기
  const searchDateHandler = (event) => {
    if (event.target.value === "") {
      return false;
    }

    setSearchDate(event.target.value);
  };

  return (
    <>
      {load === false ? (
        <LoadingNog />
      ) : (
        <>
          <div className={style.body}>
            <Header sub_title="홈 분석" />

            <div className={style.container}>
              <div className={style.title}>
                <h1>
                  {(searchDate ? searchDate : now).substr(-2) <= 10
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

              <div
                className={`${style.keyword_box} ${style.bill_box}`}
                onClick={() => handleBoxClick(1)}
              >
                <div>
                  {searchDate !== "" && searchDate !== now ? (
                    <span>이번 달 전기 요금</span>
                  ) : (
                    <span>이번 달 예상 전기 요금</span>
                  )}
                </div>

                <div>
                  {searchDate !== "" && searchDate !== now ? (
                    <h1>
                      {chartData1["my_this_month_bill"]
                        ? chartData1["my_this_month_bill"].toLocaleString(
                            "ko-KR"
                          )
                        : "데이터 없음"}{" "}
                      원
                    </h1>
                  ) : (
                    <h1>
                      {predData
                        ? predData["total_bill"].toLocaleString("ko-KR")
                        : 0}
                      원
                    </h1>
                  )}
                </div>

                <span className={style.open}>
                  {" "}
                  {visibleContainers["1"] ? "▲" : "▼"}{" "}
                </span>
              </div>
              {/*도넛 차트 박스  */}
              <div
                className={
                  visibleContainers["1"]
                    ? style.box_container
                    : style.box_container_close
                }
              >
                <div className={style.chart_box}>
                  {/* 도넛 제목 박스 */}
                  <div
                    className={style.chart_title_box}
                    onClick={() => handleBoxClick(1)}
                  >
                    <h1 className={style.chart_box_title}>
                      이번 달 소비 전력량{" "}
                    </h1>
                    <span className={style.spring}></span>
                    {/* <span className={style.close} > ▲</span> */}
                  </div>
                  <DoughnutChart
                    data1={[
                      chartData1["average_total_usage"],
                      chartData1["my_total_usage"],

                      Math.round(
                        (chartData1["my_total_usage"] /
                          chartData1["average_total_usage"]) *
                          1000
                      ) / 10,
                    ]}
                  />

                  <div></div>
                  {/* 해설상자 */}
                  <div className={style.text_box}>
                    <p>
                      이번 달 현재까지와 저번 달, 지역 평균의 전력 사용량의
                      비교입니다.
                    </p>

                    <table>
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
                          <th>사용량</th>
                          <td>
                            {chartData1["my_total_usage"]
                              ? chartData1["my_total_usage"]
                              : 0}{" "}
                            kWh
                          </td>
                          <td>{chartData1["my_total_usage_last"]} kWh</td>
                          <td>{chartData1["average_total_usage"]} kWh</td>
                        </tr>
                        <tr>
                          <th>요금</th>
                          <td>
                            {chartData1["my_this_month_bill"]
                              ? chartData1["my_this_month_bill"].toLocaleString(
                                  "ko-KR"
                                )
                              : "데이터 없음"}{" "}
                            원
                          </td>
                          <td>
                            {chartData1["my_before_month_bill"]
                              ? chartData1[
                                  "my_before_month_bill"
                                ].toLocaleString("ko-KR")
                              : "데이터 없음"}{" "}
                            원
                          </td>
                          <td>
                            {chartData1["city_before_month_bill"]
                              ? chartData1[
                                  "city_before_month_bill"
                                ].toLocaleString("ko-KR")
                              : "데이터 없음"}{" "}
                            원
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {predData && predData["total"] ? (
                      <>
                        <p className={style.pred_text}>
                          NOG가 평가한 이번 달 예상 총 사용량은
                          <span className={style.important_keywords}>
                            {predData["total"] ? predData["total"] : 0}kwh
                          </span>
                          , 요금은{" "}
                          <span className={style.important_keywords}>
                            {predData["total_bill"]
                              ? predData["total_bill"].toLocaleString("ko-KR")
                              : 0}
                            원
                          </span>
                          입니다.
                        </p>
                      </>
                    ) : null}
                  </div>
                  <div
                    className={style.bottom_close}
                    onClick={() => handleBoxClick(1)}
                  >
                    ▲
                  </div>
                </div>
              </div>

              <div
                className={style.keyword_box}
                onClick={() => handleBoxClick(2)}
              >
                <div>
                  <span>
                    {chartData2["user_type"] ? chartData2["user_type"] : "오전"}{" "}
                    소비 유형
                  </span>
                  <span>12시-5시</span>
                </div>
                <div>이미지</div>

                <span className={style.open}>
                  {" "}
                  {visibleContainers["2"] ? "▲" : "▼"}
                </span>
              </div>

              {/* 두번째 줄 */}
              <div
                className={
                  visibleContainers["2"]
                    ? style.box_container
                    : style.box_container_close
                }
              >
                <div className={style.chart_box}>
                  <div
                    className={style.chart_title_box}
                    onClick={() => handleBoxClick(2)}
                  >
                    <span className={style.chart_box_title}>소비 유형 </span>
                    <span className={style.spring}></span>
                    {/* <span className={style.close}> ▲</span> */}
                  </div>

                  <PieChart
                    chart_Data2={
                      chartData2["usage_percentage"] &&
                      chartData2["usage_percentage"]
                    }
                  />
                  {/* 해설상자 */}
                  <div className={style.text_box}>
                    <p>회원님의 전력 소비 시간대 별 전력 소비량 비교 입니다.</p>

                    <table>
                      <thead>
                        <tr>
                          <th>시간대</th>

                          <th>사용량</th>
                          <th>사용비율</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>오전</th>
                          <td>
                            {chartData2 &&
                            chartData2["my_usage"] &&
                            chartData2["my_usage"]["usage_5_10"]
                              ? chartData2["my_usage"]["usage_5_10"]
                              : 0}{" "}
                            kWh
                          </td>
                          <td>
                            {chartData2["usage_percentage"]
                              ? chartData2["usage_percentage"]["오전"] + " %"
                              : "데이터 없음"}
                          </td>
                        </tr>
                        <tr>
                          <th>오후</th>
                          <td>
                            {chartData2 &&
                            chartData2["my_usage"] &&
                            chartData2["my_usage"]["usage_11_16"]
                              ? chartData2["my_usage"]["usage_11_16"]
                              : 0}{" "}
                            kWh
                          </td>
                          <td>
                            {chartData2["usage_percentage"]
                              ? chartData2["usage_percentage"]["오후"] + " %"
                              : "데이터 없음"}
                          </td>
                        </tr>
                        <tr>
                          <th>저녁</th>
                          <td>
                            {chartData2 &&
                            chartData2["my_usage"] &&
                            chartData2["my_usage"]["usage_17_22"]
                              ? chartData2["my_usage"]["usage_17_22"]
                              : 0}{" "}
                            kWh
                          </td>
                          <td>
                            {chartData2["usage_percentage"]
                              ? chartData2["usage_percentage"]["저녁"] + " %"
                              : "데이터 없음"}
                          </td>
                        </tr>
                        <tr>
                          <th>심야,새벽</th>
                          <td>
                            {chartData2 &&
                            chartData2["my_usage"] &&
                            chartData2["my_usage"]["usage_23_4"]
                              ? chartData2["my_usage"]["usage_23_4"]
                              : 0}{" "}
                            kWh
                          </td>
                          <td>
                            {chartData2["usage_percentage"]
                              ? chartData2["usage_percentage"]["심야,새벽"] +
                                " %"
                              : "데이터 없음"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p className={style.pred_text}>
                      고객님의 시간별 전력 소비량을 합산한 결과, NOG가 평가한
                      고객님의 소비 유형은{" "}
                      <span className={style.important_keywords}>
                        '
                        {chartData2["user_type"]
                          ? chartData2["user_type"]
                          : "오전"}
                        '
                      </span>
                      소비형입니다.
                    </p>
                  </div>
                  <div
                    className={style.bottom_close}
                    onClick={() => handleBoxClick(2)}
                  >
                    ▲
                  </div>
                </div>
              </div>
              <div
                className={style.keyword_box}
                onClick={() => handleBoxClick(3)}
              >
                <div>
                  <span>소비량이 가장 많은 요일</span>
                </div>
                <div>
                  {" "}
                  <h1>
                    {chartData3["max_day"]
                      ? chartData3["max_day"][0]
                      : "월요일"}
                  </h1>
                </div>

                <span className={style.open}>
                  {" "}
                  {visibleContainers["3"] ? "▲" : "▼"}
                </span>
              </div>
              <div
                className={
                  visibleContainers["3"]
                    ? style.box_container
                    : style.box_container_close
                }
              >
                <div className={style.chart_box}>
                  <div
                    className={style.chart_title_box}
                    onClick={() => handleBoxClick(3)}
                  >
                    <span className={style.chart_box_title}>
                      요일별 소비 패턴
                    </span>
                    <span className={style.spring}></span>
                    {/* <span className={style.close} > ▲</span>   */}
                  </div>
                  <LineChart data3={chartData3}></LineChart>
                  {/* 해설상자 */}
                  <div className={style.text_box}>
                    <p>
                      회원님과{" "}
                      {user["user_city"] ? user["user_city"] : "같은 도시"}의
                      요일 별 평균 사용량 비교입니다.
                    </p>
                    <table>
                      <thead>
                        <tr>
                          <th></th>

                          <th>나의 평균</th>
                          <th>지역평균</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>최대 소비 요일</th>
                          <td>
                            {chartData3["max_day"]
                              ? chartData3["max_day"][0]
                              : "데이터 없음"}
                          </td>
                          <td>
                            {chartData3["max_day"]
                              ? chartData3["max_day"][1]
                              : "데이터 없음"}
                          </td>
                        </tr>
                        <tr>
                          <th>최대 요일 소비량</th>
                          <td>
                            {chartData3["max_day"]
                              ? Math.round(chartData3["max_day"][2])
                              : 0}{" "}
                            kWh
                          </td>
                          <td>
                            {chartData3["max_day"]
                              ? Math.round(chartData3["max_day"][3])
                              : 0}{" "}
                            kWh
                          </td>
                        </tr>
                        <tr>
                          <th>최저 소비 요일</th>
                          <td>
                            {chartData3["min_day"]
                              ? chartData3["min_day"][0]
                              : "데이터 없음"}{" "}
                          </td>
                          <td>
                            {chartData3["min_day"]
                              ? chartData3["min_day"][1]
                              : "데이터 없음"}{" "}
                          </td>
                        </tr>
                        <tr>
                          <th>최저 요일 소비량</th>
                          <td>
                            {chartData3["min_day"]
                              ? Math.round(chartData3["min_day"][2])
                              : 0}{" "}
                            kWh
                          </td>
                          <td>
                            {chartData3["min_day"]
                              ? Math.round(chartData3["min_day"][3])
                              : 0}{" "}
                            kWh
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    className={style.bottom_close}
                    onClick={() => handleBoxClick(3)}
                  >
                    ▲
                  </div>
                </div>
              </div>

              {/* 네번째줄 */}
              <div
                className={style.keyword_box}
                onClick={() => handleBoxClick(4)}
              >
                <div>
                  <span>이번 달 가장 사용량이 많았던 날</span>
                </div>
                <div>
                  <h1>
                    {chartData3 && chartData3["max"] && chartData3["max"][0]
                      ? chartData3["max"][0]
                      : 1}
                    일
                  </h1>
                </div>

                <span className={style.open}>
                  {" "}
                  {visibleContainers["4"] ? "▲" : "▼"}
                </span>
              </div>

              <div
                className={
                  visibleContainers["4"]
                    ? style.box_container
                    : style.box_container_close
                }
              >
                <div className={style.chart_box}>
                  <div
                    className={style.chart_title_box}
                    onClick={() => handleBoxClick(4)}
                  >
                    <span className={style.chart_box_title}>
                      이번 달 소비 패턴
                    </span>

                    <span className={style.spring}></span>
                    {/* <span className={style.close} > ▲</span>   */}
                  </div>
                  <BarChartMonth
                    data5={
                      chartData3 &&
                      chartData3["my_month_use"] && [
                        chartData3["my_month_use"],
                        chartData3 &&
                          chartData3["city_month_use"] &&
                          chartData3["city_month_use"],
                      ]
                    }
                  ></BarChartMonth>
                  {/* 해설상자 */}
                  <div className={style.text_box}>
                    <p>
                      회원님과{" "}
                      {user["user_city"] ? user["user_city"] : "같은 도시"}의
                      일일 전력 사용량에 대한 비교 입니다.
                    </p>

                    <table>
                      <thead>
                        <tr>
                          <th></th>

                          <th>최대 전력 소비일</th>
                          <th>최소 전력 소비일</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>{user["user_name"]}님</th>
                          <td>
                            {chartData3["max_month"]
                              ? chartData3["max_month"][0] + " 일 "
                              : "데이터 없음"}

                            {chartData3["max_month"]
                              ? chartData3["max_month"][2] + " kWh"
                              : ""}
                          </td>
                          <td>
                            {chartData3["min_month"]
                              ? chartData3["min_month"][0] + " 일 "
                              : "데이터 없음"}
                            {chartData3["min_month"]
                              ? chartData3["min_month"][2] + " kWh"
                              : ""}
                          </td>
                        </tr>
                        <tr>
                          <th>지역평균</th>
                          <td>
                            {chartData3["max_month"]
                              ? chartData3["max_month"][1] + " 일 "
                              : "데이터 없음"}
                            {chartData3["max_month"]
                              ? chartData3["max_month"][3] + " kWh"
                              : ""}
                          </td>
                          <td>
                            {chartData3["min_month"]
                              ? chartData3["min_month"][1] + " 일 "
                              : "데이터 없음"}
                            {chartData3["min_month"]
                              ? chartData3["min_month"][3] + " kWh"
                              : ""}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    className={style.bottom_close}
                    onClick={() => handleBoxClick(4)}
                  >
                    ▲
                  </div>
                </div>
              </div>
              <div
                className={style.keyword_box}
                onClick={() => handleBoxClick(5)}
              >
                <div>
                  <span>하루 평균 사용량</span>
                </div>
                <div>
                  {" "}
                  <h1>
                    {chartData3 &&
                    chartData3["average"] &&
                    chartData3["average"][0]
                      ? chartData3["average"][0]
                      : 0}
                    kW
                  </h1>
                </div>

                <span className={style.open}>
                  {" "}
                  {visibleContainers["5"] ? "▲" : "▼"}
                </span>
              </div>

              <div
                className={
                  visibleContainers["5"]
                    ? style.box_container
                    : style.box_container_close
                }
              >
                <div className={style.chart_box}>
                  <div
                    className={style.chart_title_box}
                    onClick={() => handleBoxClick(5)}
                  >
                    <span className={style.chart_box_title}>
                      평균 소비 패턴
                    </span>
                    <span className={style.spring}></span>
                    {/* <span className={style.close} > ▲</span>     */}
                  </div>

                  {/* <LineChart></LineChart> */}
                  <BarChartDay
                    data4={
                      chartData3 &&
                      chartData3["average"] &&
                      chartData3["average"]
                    }
                  ></BarChartDay>

                  {/* 해설상자 */}
                  <div className={style.text_box}>
                    {/* <p>이번달 일일 평균 사용량은 {chartData3["average"][0]}kw 입니다.</p> */}

                    <p>
                      회원님과{" "}
                      {user["user_city"] ? user["user_city"] : "같은 도시"}의
                      이번 달 일일 평균 전력 사용량에 대한 비교 입니다.
                    </p>

                    <table>
                      <thead>
                        <tr>
                          <th></th>

                          <th>{user["user_name"]}님</th>
                          <th>지역평균</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>평균 소비량</th>
                          <td>
                            {chartData3 &&
                            chartData3["average"] &&
                            chartData3["average"][0]
                              ? chartData3["average"][0] + " kWh"
                              : "데이터 없음"}
                          </td>
                          <td>
                            {chartData3 &&
                            chartData3["average"] &&
                            chartData3["average"][1]
                              ? chartData3["average"][1] + " kWh"
                              : "데이터 없음"}
                          </td>
                        </tr>
                        <tr>
                          <th>소비 차이</th>
                          <td colSpan={2}>
                            {chartData3 &&
                            chartData3["average"] &&
                            chartData3["average"]
                              ? chartData3["average"][2] >= 0
                                ? "약 " +
                                  chartData3["average"][2] +
                                  " kWh 많이 소비"
                                : "약 " +
                                  chartData3["average"][2] * -1 +
                                  " kWh 적게 소비"
                              : "데이터 없음"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    className={style.bottom_close}
                    onClick={() => handleBoxClick(5)}
                  >
                    ▲
                  </div>
                </div>
              </div>

              <div
                className={style.keyword_box}
                onClick={() => handleBoxClick(6)}
              >
                <div>
                  <span>지역주민 대비 사용량</span>
                </div>
                <div>
                  <h1>
                    {Math.round(
                      (chartData1["my_total_usage"] /
                        chartData1["average_total_usage"]) *
                        1000
                    ) / 10}
                    %{" "}
                  </h1>
                </div>

                <span className={style.open}>
                  {" "}
                  {visibleContainers["6"] ? "▲" : "▼"}
                </span>
              </div>

              <div
                className={
                  visibleContainers["6"]
                    ? style.box_container
                    : style.box_container_close
                }
              >
                <div className={style.chart_box}>
                  <div
                    className={style.chart_title_box}
                    onClick={() => handleBoxClick(6)}
                  >
                    <span className={style.chart_box_title}>
                      도시인구 대비 비교
                    </span>
                    <span className={style.spring}></span>
                    {/* <span className={style.close} > ▲</span>     */}
                  </div>
                  <RadarChart
                    data5={[chartData2["city_usage"], chartData2["my_usage"]]}
                  />
                  {/* 해설상자 */}
                  <div className={style.text_box}>
                    <p>
                      회원님의 이번 달 시간대 별 사용량과{" "}
                      {user["user_city"] ? user["user_city"] : "같은 도시"}의
                      지난 달 시간대 별 평균 사용량과의 비교 입니다.
                    </p>
                    <table>
                      <thead>
                        <tr>
                          <th>시간대</th>

                          <th>{user["user_name"]}님</th>
                          <th>지역평균</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>오전</th>
                          <td>
                            {chartData2 &&
                            chartData2["my_usage"] &&
                            chartData2["my_usage"]["usage_5_10"]
                              ? chartData2["my_usage"]["usage_5_10"]
                              : 0}{" "}
                            kWh
                          </td>
                          <td>
                            {chartData2 &&
                            chartData2["city_usage"] &&
                            chartData2["city_usage"]["usage_5_10"]
                              ? chartData2["city_usage"]["usage_5_10"]
                              : 0}{" "}
                            kWh
                          </td>
                        </tr>
                        <tr>
                          <th>오후</th>
                          <td>
                            {chartData2 &&
                            chartData2["my_usage"] &&
                            chartData2["my_usage"]["usage_11_16"]
                              ? chartData2["my_usage"]["usage_11_16"]
                              : 0}{" "}
                            kWh
                          </td>
                          <td>
                            {chartData2 &&
                            chartData2["city_usage"] &&
                            chartData2["city_usage"]["usage_11_16"]
                              ? chartData2["city_usage"]["usage_11_16"]
                              : 0}{" "}
                            kWh
                          </td>
                        </tr>
                        <tr>
                          <th>저녁</th>
                          <td>
                            {chartData2 &&
                            chartData2["my_usage"] &&
                            chartData2["my_usage"]["usage_17_22"]
                              ? chartData2["my_usage"]["usage_17_22"]
                              : 0}{" "}
                            kWh
                          </td>
                          <td>
                            {chartData2 &&
                            chartData2["city_usage"] &&
                            chartData2["city_usage"]["usage_17_22"]
                              ? chartData2["city_usage"]["usage_17_22"]
                              : 0}{" "}
                            kWh
                          </td>
                        </tr>
                        <tr>
                          <th>심야,새벽</th>
                          <td>
                            {chartData2 &&
                            chartData2["my_usage"] &&
                            chartData2["my_usage"]["usage_23_4"]
                              ? chartData2["my_usage"]["usage_23_4"]
                              : 0}{" "}
                            kWh
                          </td>
                          <td>
                            {chartData2 &&
                            chartData2["city_usage"] &&
                            chartData2["city_usage"]["usage_23_4"]
                              ? chartData2["city_usage"]["usage_23_4"]
                              : 0}{" "}
                            kWh
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className={style.bottom_close}>▲</div>
                </div>

                <div className={style.chart_box}>
                  <div
                    className={style.chart_title_box}
                    onClick={() => handleBoxClick(6)}
                  >
                    <span className={style.chart_box_title}>월간 비교</span>
                    <span className={style.spring}></span>
                    {/* <span className={style.close} > ▲</span>     */}
                  </div>

                  <BarChart data6={[chartData1, chartData4]}></BarChart>
                  {/* 해설상자 */}
                  <div className={style.text_box}>
                    <p>
                      회원님과{" "}
                      {user["user_city"] ? user["user_city"] : "같은 도시"}의
                      이번 달, 지난달, 전년동월의 전력소모량 비교 입니다.
                    </p>
                    <table>
                      <thead>
                        <tr>
                          <th>측정(월)</th>

                          <th>{user["user_name"]}님</th>
                          <th>지역평균</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th>이번 달</th>
                          <td>
                            {chartData1["my_total_usage"]
                              ? chartData1["my_total_usage"]
                              : 0}{" "}
                            kWh
                          </td>
                          <td>
                            {chartData4
                              ? chartData4["city_average_daily_usage"]
                              : 0}{" "}
                            kWh
                          </td>
                        </tr>
                        <tr>
                          <th>지난 달</th>
                          <td>
                            {chartData1["my_total_usage_last"]
                              ? chartData1["my_total_usage_last"]
                              : 0}{" "}
                            kWh
                          </td>
                          <td>
                            {chartData1["average_total_usage"]
                              ? chartData1["average_total_usage"]
                              : 0}{" "}
                            kWh
                          </td>
                        </tr>
                        <tr>
                          <th>전년동월</th>
                          <td>
                            {chartData4
                              ? chartData4["user_month_total_last_year"]
                              : 0}{" "}
                            kWh
                          </td>
                          <td>
                            {" "}
                            {chartData4
                              ? chartData4["city_month_total_last_year"]
                              : 0}{" "}
                            kWh
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    className={style.bottom_close}
                    onClick={() => handleBoxClick(6)}
                  >
                    ▲
                  </div>
                </div>
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
