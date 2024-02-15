import React, { useEffect, useState, useRef } from "react";
import Header from "../common/jsx/Header";
import common from "../common/css/common.module.css";
import style from "./css/NogiAnalysis.module.css";
import axios from "axios";
import Chart from "chart.js/auto";
import LoadingNog from "../common/jsx/LoadingNog";

function NogiAnalysis() {
  const [chartData1, setChartData1] = useState(null);
  const [chartData2, setChartData2] = useState(null);
  const [tableData1, setTableData1] = useState(null);
  const [tableData2, setTableData2] = useState(null);
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const [selectedBoard1, setSelectedBoard1] = useState(null);
  const [selectedBoard2, setSelectedBoard2] = useState(null);
  const [visibleContainers, setVisibleContainers] = useState({
    chatbot: true,
    withdrawl: false,
  });
  const [showChatbot, setShowChatBot] = useState(true);
  const [showDelReason, setShowDelReason] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 로딩 상태를 기반으로 로딩 화면을 표시하는 useEffect
  useEffect(() => {
    // 로딩 시작
    setIsLoading(true);

    // 2초 후에 로딩 완료
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  // 챗봇-탈퇴사유 토글 버튼
  const clickChatbot = () => {
    if (showDelReason) {
      setShowChatBot((prev) => !prev);
      setShowDelReason((prev) => !prev);
    }
  };
  const clickDelReason = () => {
    if (showChatbot) {
      setShowChatBot((prev) => !prev);
      setShowDelReason((prev) => !prev);
    }
  };

  // 로딩
  // 로딩 상태를 기반으로 로딩 화면을 표시하는 useEffect
  useEffect(() => {
    // 로딩 시작
    setIsLoading(true);

    // 2초 후에 로딩 완료
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        "http://192.168.0.67:5000/nog_analysis"
      );
      const data1 = response.data.chartdata1;
      const data2 = response.data.chartdata2;
      const data3 = JSON.parse(response.data.similardata);
      const data4 = JSON.parse(response.data.exitdata);
      setChartData1(data1);
      setChartData2(data2);
      setTableData1(data3);
      setTableData2(data4);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef1.current && chartData1) {
      // 차트가 그려질때 이전 차트 파괴
      if (chartRef1.current.chart) {
        chartRef1.current.chart.destroy();
      }
      const ctx = chartRef1.current.getContext("2d");

      chartRef1.current.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartData1.labels,
          datasets: [
            {
              data: chartData1.count,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false, // 범주 숨김
            },
          },
        },
      });
    }
  }, [chartData1]);

  useEffect(() => {
    if (chartRef2.current && chartData2) {
      // 차트가 그려질때 이전 차트 파괴
      if (chartRef2.current.chart) {
        chartRef2.current.chart.destroy();
      }
      const ctx = chartRef2.current.getContext("2d");

      chartRef2.current.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartData2.labels,
          datasets: [
            {
              data: chartData2.count,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false, // 범주 숨김
            },
          },
        },
      });
    }
  }, [chartData2]);

  //  ------- 게시글 상세정보 -------
  const handleBoardClick1 = (rowData) => {
    setSelectedBoard1(rowData);
  };

  const handleCloseModal1 = () => {
    setSelectedBoard1(null);
  };

  const handleBoardClick2 = (rowData) => {
    setSelectedBoard2(rowData);
  };

  const handleCloseModal2 = () => {
    setSelectedBoard2(null);
  };

  // 키워드 박스를 눌렀을 때 해당 키워드 박스에 해당하는 박스를 on/off
  const handleBoxClick = (section) => {
    if (section === "chatbot") {
      setVisibleContainers({ chatbot: true, withdrawl: false });
    } else {
      setVisibleContainers({ chatbot: false, withdrawl: true });
    }
  };

  return (
    <>
      <div className={common.background}>
        <Header sub_title="관리자" />

        <div className={style.main_area}>
          <div className={style.title}>
            <div>유저분석</div>
          </div>

          {/* 박스 컨테이너 1 - 챗봇 데이터 표와 분석 그래프 */}

          <div className={style.keyword_container}>
            <div
              className={`${style.keyword_box} ${
                showChatbot ? style.showGraph : ""
              }`}
              onClick={() => {
                handleBoxClick("chatbot");
                clickChatbot();
              }}
            >
              <h1>챗봇대화 분석</h1>
            </div>
            {/* 박스 컨테이너 2 - 탈퇴사유 표와 그래프 */}
            <div
              className={`${style.keyword_box} ${
                showDelReason ? style.showGraph : ""
              }`}
              onClick={() => {
                handleBoxClick("withdrawl");
                clickDelReason();
              }}
            >
              <h1>탈퇴사유 분석</h1>
            </div>
          </div>
          {/* Visible 컨테이너 1 - 챗봇 데이터 표와 분석 그래프 */}
          <div
            className={
              visibleContainers["chatbot"]
                ? style.box_container
                : style.box_container_close
            }
          >
            <div className={style.chart_box}>
              <div
                className={style.chart_title_box}
                onClick={() => handleBoxClick("chatbot")}
              >
                {/* 챗봇 대화 표 */}
                <div className={style.list}>
                  <div className={style.boardList_title}>
                    <div>내용</div>
                    <div>유사도</div>
                  </div>
                  <div className={style.boardList_table}>
                    <table>
                      <tbody>
                        {tableData1 &&
                          Object.keys(tableData1)
                            .map((key) => tableData1[key])
                            .filter((value) => value)
                            .sort((a, b) => a.similar - b.similar)
                            .map((value, index) => (
                              <tr
                                key={index + 1}
                                onClick={() => handleBoardClick1(value, index)}
                              >
                                <td>{value.user_question}</td>
                                <td>{value.similar}</td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* 챗봇 대화 그래프 */}
                <div className={style.list}>
                  <div className={style.boardList_title}>
                    <div>질문 패턴 분석</div>
                  </div>
                  <div className={style.boardList_graph}>
                    <canvas
                      className={style.canvas1}
                      ref={chartRef1}
                      width={400}
                      height={400}
                    ></canvas>
                  </div>
                </div>
                {selectedBoard1 && (
                  <div className={style.custom_modal}>
                    <div className={style.modal_container}>
                      <hr className={style.bookends} />
                      <div className={style.modal_title}>챗봇 대화</div>
                      <div className={style.modal_content}>
                        <p>회원: {selectedBoard1.chat_user_id}</p>
                        <p>
                          사용자 질문: {""}
                          {selectedBoard1.user_question.length > 12
                            ? `${selectedBoard1.user_question.substring(
                                0,
                                12
                              )}\n${selectedBoard1.user_question.substring(12)}`
                            : selectedBoard1.user_question}
                        </p>
                        <p>
                          예상 질문: {""}
                          {selectedBoard1.data_question.length > 15
                            ? `${selectedBoard1.data_question.substring(
                                0,
                                15
                              )}\n${selectedBoard1.data_question.substring(15)}`
                            : selectedBoard1.data_question}
                        </p>
                        <p>유사도: {selectedBoard1.similar}</p>
                        <p>
                          질문일자:{" "}
                          {new Date(selectedBoard1.chat_time).toLocaleString(
                            "ko-KR"
                          )}
                        </p>
                      </div>
                      <button
                        className={style.close_btn}
                        onClick={handleCloseModal1}
                      >
                        닫기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/*탈퇴사유 파트  */}

          <div
            className={
              visibleContainers["withdrawl"]
                ? style.box_container
                : style.box_container_close
            }
          >
            <div className={style.chart_box}>
              <div
                className={style.chart_title_box}
                onClick={() => handleBoxClick("withdrawl")}
              >
                {/* 탈퇴사유 표 */}
                <div className={style.list}>
                  <div className={style.boardList_title}>
                    <div>탈퇴일자</div>
                    <div>탈퇴사유</div>
                  </div>
                  <div className={style.boardList_table}>
                    <table>
                      <tbody>
                        {tableData2 &&
                          Object.keys(tableData2)
                            .map((key) => tableData2[key])
                            .filter((value) => value)
                            .sort(
                              (a, b) =>
                                new Date(a.exit_date) - new Date(b.exit_date)
                            )
                            .map((value, index) => (
                              <tr
                                key={index + 1}
                                onClick={() => handleBoardClick2(value, index)}
                              >
                                <td>
                                  {new Date(value.exit_date).toLocaleString(
                                    "ko-KR",
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    }
                                  )}
                                </td>
                                <td>{value.exit_content}</td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* 탈퇴사유 그래프 */}
                <div className={style.list}>
                  <div className={style.boardList_title}>
                    <div>탈퇴 사유 분석</div>
                  </div>
                  <div className={style.boardList_graph}>
                    <table>
                      <tbody>
                        <canvas
                          className={style.canvas2}
                          ref={chartRef2}
                          width={200}
                          height={200}
                        ></canvas>
                      </tbody>
                    </table>
                  </div>
                </div>
                {selectedBoard2 && (
                  <div className={style.custom_modal}>
                    <div className={style.modal_container}>
                      <hr className={style.bookends} />
                      <div className={style.modal_title}>챗봇 대화</div>
                      <div className={style.modal_content}>
                        <p>탈퇴 회원 거주지역: {selectedBoard2.user_address}</p>
                        <p>
                          탈퇴 사유: {""}
                          {selectedBoard2.exit_content.length > 12
                            ? `${selectedBoard2.exit_content.substring(
                                0,
                                12
                              )}\n${selectedBoard2.exit_content.substring(12)}`
                            : selectedBoard2.exit_content}
                        </p>
                        <p>
                          질문일자:{" "}
                          {new Date(selectedBoard2.exit_date).toLocaleString(
                            "ko-KR"
                          )}
                        </p>
                      </div>
                      <button
                        className={style.close_btn}
                        onClick={handleCloseModal2}
                      >
                        닫기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NogiAnalysis;
