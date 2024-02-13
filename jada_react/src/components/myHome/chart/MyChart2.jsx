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

  const [chartData1, setChartData1] = useState([]);
  const [chartData2, setChartData2] = useState([]);
  const [chartData3, setChartData3] = useState([]);
  const [chartData2pattern, setChartData2pattern] = useState({});
  const [myType, setMyType] = useState({});
  const [userData, setMyCity] = useState("");
  const [chartData4, setChartData4] = useState([]);
  const [user, setUser] = useState({});
  const [searchDate, setSearchDate] = useState("");
  const [load, setLoad] = useState(false);

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

  // 회원 정보로 검색 완료된 후 예측
  useEffect(() => {
    const fetchPred = async () => {
      try {
        // axios로 GET 요청 보내기
        const response = await axios.get(
          `http://192.168.0.84:5001/pred?user_id=${user["user_id"]}${
            searchDate ? "&date=" + searchDate : ""
          }`
        );

        // 응답에서 데이터 추출하고 상태 업데이트
        const data = response.data;
        console.log(data.total[0]);
        setUser({
          user_id: user["user_id"],
          user_name: user["user_name"],
          user_city: user["user_city"],
          user_pred: data.total[0],
        });
      } catch (error) {
        console.error("Error fetching graph data:", error);
      } finally {
      }
    };
    if (load) {
      fetchPred();
    }
  }, [load]);

  // 요금 계산기
  function calculateBill(usage) {
    let bill = 0;
    if (usage <= 300) {
      bill = usage * 120.0;
    } else if (usage <= 450) {
      bill = 300 * 120.0 + (usage - 300) * 214.6;
    } else {
      bill = 300 * 120.0 + 150 * 214.6 + (usage - 450) * 307.3;
    }
    return Math.round(bill, 0);
  }

  function calculateDay(object) {
    let maxValue = Number.MIN_SAFE_INTEGER;
    let maxKey = null;

    for (const key in object) {
      const value = object[key];
      if (value > maxValue) {
        maxValue = value;
        maxKey = key;
      }
    }

    const ko = {
      Monday: "월요일",
      Tuesday: "화요일",
      Wednesday: "수요일",
      Thursday: "목요일",
      Friday: "금요일",
      Saturday: "토요일",
      Sunday: "일요일",
    };

    return ko[maxKey];
  }

  return (
    <>
      {load == false ? (
        <LoadingNog />
      ) : (
        <>
          <div className={style.body}>
            <Header sub_title="홈 분석" />

            <div className={style.container}>
              <div className={style.title}>
                <h1>
                  {" "}
                  {user["user_name"] ? user["user_name"] + "님의 " : ""}패턴분석
                </h1>
                <span>{user["user_city"] ? user["user_city"] : ""}</span>
              </div>

              <div
                className={style.keyword_box}
                onClick={() => handleBoxClick(1)}
              >
                <h1>
                  {chartData1["my_total_usage"]
                    ? chartData1["my_total_usage"]
                    : 0}
                  kw{" "}
                </h1>
                <span>이달 사용 전력</span>

                <h1>
                  {chartData1["my_total_usage"]
                    ? calculateBill(
                        chartData1["my_total_usage"]
                      ).toLocaleString("ko-KR")
                    : 0}
                  원
                </h1>
                <span>사용요금</span>

                <h1>
                  {chartData1["my_total_usage"]
                    ? (
                        calculateBill(chartData1["my_total_usage_last"]) -
                        calculateBill(chartData1["my_total_usage"])
                      ).toLocaleString("ko-KR")
                    : 0}
                  원
                </h1>
                <span>직전달 대비 절약 금액</span>
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
                      이달 소비 전력량(kWh){" "}
                    </h1>
                    <span className={style.spring}></span>
                    {/* <span className={style.close} > ▲</span> */}
                  </div>
                  <DoughnutChart
                    data1={[
                      chartData1["average_total_usage"],
                      chartData1["my_total_usage"],
                    ]}
                  />

                  <div></div>
                  {/* 해설상자 */}
                  <div className={style.text_box}>
                    <p>
                      이번달 사용량은{" "}
                      {chartData1["my_total_usage"]
                        ? chartData1["my_total_usage"]
                        : 0}
                      kwh 입니다. 이는 전달 지역 평균 사용량{" "}
                      {chartData1["average_total_usage"]}kwh의{" "}
                      {Math.round(
                        (chartData1["my_total_usage"] /
                          chartData1["average_total_usage"]) *
                          1000
                      ) / 10}
                      % 에 해당합니다.{" "}
                    </p>
                    <p>
                      또한 현재까지의 요금은 약{" "}
                      {calculateBill(
                        chartData1["my_total_usage"]
                      ).toLocaleString("ko-KR")}
                      원 이며, 이 패턴의 소비가 계속 되었을때 NOG가 평가한
                    </p>
                    <p>
                      {" "}
                      이달 예상 총 사용량은{" "}
                      {user["user_pred"] ? user["user_pred"] : 0}kwh, 요금은{" "}
                      {user["user_pred"]
                        ? calculateBill(user["user_pred"]).toLocaleString(
                            "ko-KR"
                          )
                        : 0}
                      원입니다.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={style.keyword_box}
                onClick={() => handleBoxClick(2)}
              >
                <h1>
                  {chartData2["user_type"] ? chartData2["user_type"] : "오전"}{" "}
                  소비 유형
                </h1>
                <span>가장 많은 소비시간대</span>
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
                    {/* <span className={style.close}> ▲</span>   */}
                  </div>

                  <PieChart chart_Data2={chartData2["usage_percentage"]} />
                  {/* 해설상자 */}
                  <div className={style.text_box}>
                    <p>회원님의 전력 소비 시간대 비율은</p>
                    <p>
                      - 오전:{" "}
                      {chartData2["usage_percentage"]
                        ? chartData2["usage_percentage"]["오전"]
                        : 25}
                      %{" "}
                    </p>
                    <p>
                      - 오후:{" "}
                      {chartData2["usage_percentage"]
                        ? chartData2["usage_percentage"]["오후"]
                        : 25}
                      %
                    </p>
                    <p>
                      - 저녁:{" "}
                      {chartData2["usage_percentage"]
                        ? chartData2["usage_percentage"]["저녁"]
                        : 25}
                      %{" "}
                    </p>
                    <p>
                      - 심야,새벽:{" "}
                      {chartData2["usage_percentage"]
                        ? chartData2["usage_percentage"]["심야,새벽"]
                        : 25}
                      % 입니다.
                    </p>
                    <p>
                      소중한 소비 데이터로 NOG가 평가한 고객님의 소비 유형은 '
                      {chartData2["user_type"]
                        ? chartData2["user_type"]
                        : "오전"}
                      ' 소비형입니다.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={style.keyword_box}
                onClick={() => handleBoxClick(3)}
              >
                <h1>
                  {chartData3 &&
                  chartData3["weekly_my_usage_sum"] &&
                  calculateDay(chartData3["weekly_my_usage_sum"])
                    ? calculateDay(chartData3["weekly_my_usage_sum"])
                    : "월요일"}
                </h1>
                <span>소비량이 가장 많은 요일</span>
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
                      회원님은 이번 달 "
                      {chartData3 &&
                        chartData3["weekly_my_usage_sum"] &&
                        calculateDay(chartData3["weekly_my_usage_sum"])}
                      "에 가장 많은 전력 소비를 한 것을 확인됩니다.
                    </p>
                    <p>
                      또한,{" "}
                      {user["user_city"] ? user["user_city"] : "같은 도시"}의
                      이웃들은 평균적으로 "
                      {chartData3 &&
                        chartData3["weekly_my_usage_sum"] &&
                        calculateDay(chartData3["weekly_city_usage_sum"])}
                      "에 가장 많은 전력 소비를 하는 것으로 확인됩니다.{" "}
                    </p>
                  </div>
                </div>
              </div>

              {/* 네번째줄 */}
              <div
                className={style.keyword_box}
                onClick={() => handleBoxClick(4)}
              >
                <h1>
                  {chartData3 && chartData3["max"] && chartData3["max"][0]
                    ? chartData3["max"][0]
                    : 1}
                  일
                </h1>
                <span>이달 가장 사용량이 많았던 날</span>
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
                      이달 소비 패턴
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
                      이달 가장 많은 전력을 소비한 날은{" "}
                      {chartData3 && chartData3["max"] && chartData3["max"][0]}
                      일,{" "}
                      {chartData3 && chartData3["max"] && chartData3["max"][0]
                        ? chartData3["my_month_use"][chartData3["max"][0]]
                        : 0}
                      kWh 입니다.{" "}
                    </p>
                    <p>
                      또한, 지역 평균적으로는 이달{" "}
                      {chartData3 && chartData3["max"] && chartData3["max"][1]}
                      일이{" "}
                      {chartData3 && chartData3["max"] && chartData3["max"][1]
                        ? chartData3["city_month_use"][chartData3["max"][1]]
                        : 0}
                      kWh로 소비 전력 소비량이 가장 많았던 것으로 집계
                      되었습니다.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={style.keyword_box}
                onClick={() => handleBoxClick(5)}
              >
                <h1>
                  {chartData3 &&
                  chartData3["average"] &&
                  chartData3["average"][0]
                    ? chartData3["average"][0]
                    : 0}
                  kW
                </h1>
                <span>하루 평균 사용량</span>
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
                      이번달 일일 평균 사용량은{" "}
                      {chartData3 &&
                        chartData3["average"] &&
                        chartData3["average"][0]}
                      kw 입니다.
                    </p>

                    <p>
                      또한,{" "}
                      {user["user_city"] ? user["user_city"] : "같은 도시"}의
                      지역 평균 사용량은{" "}
                      {chartData3 &&
                        chartData3["average"] &&
                        chartData3["average"][1]}
                      kw 입니다.
                    </p>
                    <p>
                      회원님은 지역 평균 보다 약{" "}
                      {chartData3 &&
                        chartData3["average"] &&
                        Math.round(
                          ((chartData3["average"][0] -
                            chartData3["average"][1]) *
                            -100) /
                            100
                        ) * -1}
                      kWh 만큼 사용하는 편입니다.
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={style.keyword_box}
                onClick={() => handleBoxClick(6)}
              >
                <h1>
                  {Math.round(
                    (chartData1["my_total_usage"] /
                      chartData1["average_total_usage"]) *
                      1000
                  ) / 10}
                  %{" "}
                </h1>
                <span>지역주민 대비 사용량</span>
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
                      이달의 시간대 별 사용량과 지난 달 같은 지역의 시간대 별
                      평균 사용량과의 비교 입니다.
                    </p>
                    <table>
                      <thead>
                        <th>시간대</th>

                        <th>{user["user_name"]}님</th>
                        <th>지역평균</th>
                      </thead>
                      <tbody>
                        <tr>
                          <th>오전</th>
                          <td>
                            {chartData2
                              ? chartData2["my_usage"]["usage_5_10"]
                              : 0}{" "}
                            kWh
                          </td>
                          <td>
                            {chartData2
                              ? chartData2["city_usage"]["usage_5_10"]
                              : 0}{" "}
                            kWh
                          </td>
                        </tr>
                        <tr>
                          <th>오후</th>
                          <td>
                            {chartData2
                              ? chartData2["my_usage"]["usage_11_16"]
                              : 0}{" "}
                            kWh
                          </td>
                          <td>
                            {chartData2
                              ? chartData2["city_usage"]["usage_11_16"]
                              : 0}{" "}
                            kWh
                          </td>
                        </tr>
                        <tr>
                          <th>저녁</th>
                          <td>
                            {chartData2
                              ? chartData2["my_usage"]["usage_17_22"]
                              : 0}{" "}
                            kWh
                          </td>
                          <td>
                            {" "}
                            {chartData2
                              ? chartData2["city_usage"]["usage_17_22"]
                              : 0}{" "}
                            kWh
                          </td>
                        </tr>
                        <tr>
                          <th>심야,새벽</th>
                          <td>
                            {chartData2
                              ? chartData2["my_usage"]["usage_23_4"]
                              : 0}{" "}
                            kWh
                          </td>
                          <td>
                            {" "}
                            {chartData2
                              ? chartData2["city_usage"]["usage_23_4"]
                              : 0}{" "}
                            kWh
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className={style.chart_box}>
                  <div
                    className={style.chart_title_box}
                    onClick={() => handleBoxClick(6)}
                  >
                    <span className={style.chart_box_title}>비교</span>
                    <span className={style.spring}></span>
                    {/* <span className={style.close} > ▲</span>     */}
                  </div>

                  <BarChart></BarChart>
                  {/* 해설상자 */}
                  <div className={style.text_box}>
                    <p>
                      이번달 사용량은 120kw 입니다. 이는 매달 평균 사용량
                      356kw의 56%에 해당합니다.{" "}
                    </p>
                    <p>
                      또한 현재까지의 요금은 약 12500원 이며, 이 패턴의 소비가
                      계속 되었을때 NGO가 평가한
                    </p>
                    <p> 이달 예상 총 사용량은 542kw, 요금은 12344원입니다.</p>
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
