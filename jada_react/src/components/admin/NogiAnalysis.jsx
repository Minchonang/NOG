import React, { useEffect, useState, useRef } from "react";
import Header from "../common/jsx/Header";
import common from "../common/css/common.module.css";
import style from "./css/NogiAnalysis.module.css";
import axios from "axios";
import Chart from "chart.js/auto";

function NogiAnalysis() {
  const [chartData1, setChartData1] = useState(null);
  const [chartData2, setChartData2] = useState(null);
  const [tableData1, setTableData1] = useState(null);
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const [selectedBoard, setSelectedBoard] = useState(null);

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
      console.log(data3);
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
              label: "Count",
              data: chartData1.count,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
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
              label: "Count",
              data: chartData2.count,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
      });
    }
  }, [chartData2]);

  //  ------- 게시글 상세정보 -------
  const handleBoardClick = (rowData) => {
    console.log("click");
    setSelectedBoard(rowData);
    console.log(rowData);
  };

  const handleCloseModal = () => {
    setSelectedBoard(null);
  };

  return (
    <div className={common.background}>
      <Header sub_title="관리자" />

      <div className={style.main_area}>
        <div className={style.title}>
          <div>유저분석</div>
        </div>

        <div className={style.list}>
          <div className={style.boardList_title}>
            <div>User question</div>
            <div>Similarity</div>
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
                        onClick={() => handleBoardClick(value, index)}
                      >
                        <td>{value.user_question}</td>
                        <td>{value.similar}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
        {selectedBoard && (
          <div className={style.custom_modal}>
            <div className={style.modal_container}>
              <hr className={style.bookends} />
              <div className={style.modal_title}>챗봇 대화</div>
              <div className={style.modal_content}>
                <p>회원: {selectedBoard.chat_user_id}</p>
                <p>유사도: {selectedBoard.similar}</p>
                <p>
                  사용자 질문: {""}
                  {selectedBoard.user_question.length > 12
                    ? `${selectedBoard.user_question.substring(
                        0,
                        12
                      )}\n${selectedBoard.user_question.substring(12)}`
                    : selectedBoard.user_question}
                </p>
                <p>
                  가장 유사한 질문: {""}
                  {selectedBoard.data_question.length > 10
                    ? `${selectedBoard.data_question.substring(
                        0,
                        10
                      )}\n${selectedBoard.data_question.substring(10)}`
                    : selectedBoard.data_question}
                </p>
                <p>
                  질문일자:{" "}
                  {new Date(selectedBoard.chat_time).toLocaleString("ko-KR")}
                </p>
              </div>
              <button className={style.close_btn} onClick={handleCloseModal}>
                닫기
              </button>
            </div>
          </div>
        )}
        <p>질문 빈도수 그래프</p>
        <canvas ref={chartRef1} width={400} height={400}></canvas>
        <p>탈퇴사유 빈도수 그래프</p>
        <canvas ref={chartRef2} width={400} height={400}></canvas>
      </div>
    </div>
  );
}

export default NogiAnalysis;
