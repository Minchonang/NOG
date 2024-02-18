import React from "react";
import { Line } from "react-chartjs-2";
import style from "./css/MyChart.module.css";
import "chart.js/auto";

// import 'chartjs-plugin-datalabels'; // 추가한 플러그인을 import

const LineChart = ({ data3 }) => {
  const my_usage =
    data3 && data3["weekly_my_usage_sum"] ? data3["weekly_my_usage_sum"] : 0;
  const city_usage =
    data3 && data3["weekly_city_usage_sum"]
      ? data3["weekly_city_usage_sum"]
      : 0;

  const lineData = {
    labels: ["월", "화", "수", "목", "금", "토", "일"],
    datasets: [
      {
        label: "나의 소비",
        data: [
          my_usage && my_usage["Monday"] ? my_usage["Monday"] : 0,
          my_usage && my_usage["Tuesday"] ? my_usage["Tuesday"] : 0,
          my_usage && my_usage["Wednesday"] ? my_usage["Wednesday"] : 0,
          my_usage && my_usage["Thursday"] ? my_usage["Thursday"] : 0,
          my_usage && my_usage["Friday"] ? my_usage["Friday"] : 0,
          my_usage && my_usage["Saturday"] ? my_usage["Saturday"] : 0,
          my_usage && my_usage["Sunday"] ? my_usage["Sunday"] : 0,
        ],
        fill: true,
        backgroundColor: "rgba(255,139,148,0.8)",
        borderColor: "rgb(246,84,106)",
        tension: 0.3,
      },

      {
        label: "도시평균",
        data: [
          city_usage && city_usage["Monday"] ? city_usage["Monday"] : 0,
          city_usage && city_usage["Tuesday"] ? city_usage["Tuesday"] : 0,
          city_usage && city_usage["Wednesday"] ? city_usage["Wednesday"] : 0,
          city_usage && city_usage["Thursday"] ? city_usage["Thursday"] : 0,
          city_usage && city_usage["Friday"] ? city_usage["Friday"] : 0,
          city_usage && city_usage["Saturday"] ? city_usage["Saturday"] : 0,
          city_usage && city_usage["Sunday"] ? city_usage["Sunday"] : 0,
        ],
        fill: true,
        backgroundColor: "rgba(180, 180, 238, 0.8)",
        borderColor: "rgb(166,166,237)",
        tension: 0.3,
      },
    ],
  };
  const option = {
    interaction: {
      //호버시 툴팁이 뜨는 기준, 동일한 index에 놓인 값이 출력
      mode: "index",
    },
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          // padding: 10,
          font: {
            // 범례의 폰트 스타일도 지정할 수 있습니다.
            family: "Godo",
            lineHeight: 1,
          },
        },

        display: true,
      },

      tooltip: {
        // 툴팁 스타일링
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        // 툴팁 색상을 지정할 수 있습니다.
        padding: 10,
        // 툴팁 패딩을 지정할 수 있습니다.
        bodySpacing: 5,
        // 툴팁 내부의 항목들 간 간격을 조정할 수 있습니다.
        bodyFont: {
          font: {
            // 툴팁 내용의 폰트 스타일을 지정할 수 있습니다.
            family: "Godo",
          },
        },
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          // x축을 기준으로 그려지는 선(세로선)에 대한 설정
          display: true, // 선이 아예 안 그려지게 됨
          drawTicks: true, // 눈금 표시 여부를 지정
          tickLength: 4, // 눈금 길이를 지정
          color: "rgba(50, 50, 50, 0.3)",
        },
        axis: "x",
        position: "bottom", // x 축 표시 위치
        ticks: {
          minRotation: 0, // x축 값의 회전 각도
          padding: 5, // x축 값의 상하 패딩
        },
      },
      y: {
        type: "linear", // 리니어 스케일뿐만 아니라 로그 스케일로도 표시할 수 있다.
        grid: {
          color: "rgba(50, 50, 50, 0.3)",
        },

        axis: "y", // 이 축이 y축임을 명시해준다.
        display: true, // 축의 가시성 여부도 설정할 수 있다.
        position: "left", // 축이 왼쪽에 표시될지, 오른쪽에 표시될지 정할 수 있다.
        title: {
          display: true,
          align: "end",
          color: "#808080",
          font: {
            family: "Godo",
          },
          text: "(단위: kWh)",
        },
      },
    },
  };

  return <Line data={lineData} options={option} className={style.line_chart} />;
};

export default LineChart;
