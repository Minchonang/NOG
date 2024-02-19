import React from "react";
import { Radar } from "react-chartjs-2";
import style from "./css/MyChart.module.css";

const RadarChart = ({ data5 }) => {
  const city_usage_5_10 = data5[0] ? data5[0]["usage_5_10"] : 0;
  const city_usage_11_16 = data5[0] ? data5[0]["usage_11_16"] : 0;
  const city_usage_17_22 = data5[0] ? data5[0]["usage_17_22"] : 0;
  const city_usage_23_4 = data5[0] ? data5[0]["usage_23_4"] : 0;

  const my_usage_5_10 = data5[1] ? data5[1]["usage_5_10"] : 0;
  const my_usage_11_16 = data5[1] ? data5[1]["usage_11_16"] : 0;
  const my_usage_17_22 = data5[1] ? data5[1]["usage_17_22"] : 0;
  const my_usage_23_4 = data5[1] ? data5[1]["usage_23_4"] : 0;

  const data = {
    labels: ["오전(5-10)", "오후(11-16)", "저녁(17-22)", "심야,새벽(23-4)"],
    datasets: [
      {
        label: "도시인구 평균",
        data: [
          city_usage_5_10,
          city_usage_11_16,
          city_usage_17_22,
          city_usage_23_4,
        ], // 각 시간대별 사용한 시간 (예: 시간 단위)
        backgroundColor: "rgba(0, 99, 155, 0.2)",
        borderColor: "rgba(0, 99, 132, 1)",
        borderWidth: 1,
        lineTension: 0.5,
      },

      {
        label: "내 사용시간 ",
        data: [my_usage_5_10, my_usage_11_16, my_usage_17_22, my_usage_23_4], // 각 시간대별 사용한 시간 (예: 시간 단위)
        backgroundColor: "rgba(255,182,156, 0.7)",
        borderColor: "rgba(255,127,80, 1)",
        borderWidth: 1,
        lineTension: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    scales: {
      r: {
        grid: {
          color: "rgba(0, 0, 0, 1)",
        },
        suggestedMin: 0,
        ticks: {
          stepSize: 500,
          color: "rgba(0,0,0,1)",
          backdropColor: "rgba(0,0,0,0)",
          font: {
            size: 18,
          },
        },
        pointLabels: {
          font: {
            size: 13,
            family: "Godo",
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "black",
          font: {
            size: 13,
            family: "Godo",
          },
        },
      },
    },
  };
  return <Radar data={data} options={options} className={style.radar_chart} />;
};

export default RadarChart;
