import React, { useEffect, useState, useRef } from "react";
import Header from "../common/jsx/Header";
import common from "../common/css/common.module.css";
import style from "./css/UserList.module.css";
import axios from "axios";
import Chart from "chart.js/auto";

function NogiAnalysis() {
  const [chartData1, setChartData1] = useState(null);
  const [chartData2, setChartData2] = useState(null);
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        "http://192.168.0.67:5000/nog_analysis"
      );
      const data1 = response.data.chartdata1;
      const data2 = response.data.chartdata2;
      const data3 = response.data.similardata;
      setChartData1(data1);
      setChartData2(data2);
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

  return (
    <div className={common.background}>
      <Header sub_title="관리자" />

      <div className={style.main_area}>
        <div className={style.title}>
          <div>노지분석</div>
        </div>
        <p>이 페이지는 노지분석을 보여주는 페이지입니다.</p>
        <p>질문 빈도수 그래프</p>
        <canvas ref={chartRef1} width={400} height={400}></canvas>
        <p>탈퇴사유 빈도수 그래프</p>
        <canvas ref={chartRef2} width={400} height={400}></canvas>
      </div>
    </div>
  );
}

export default NogiAnalysis;
