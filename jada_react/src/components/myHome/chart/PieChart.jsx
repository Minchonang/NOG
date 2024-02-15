import React from "react";
import { Doughnut } from "react-chartjs-2";
import style from "./css/MyChart.module.css";

const PieChart = ({ chart_Data2 }) => {
  // // 나의 월 소비 패턴
  // const my_pattern =  data2[0]
  // const total_usage= my_pattern["usage_23_4"]+my_pattern["usage_5_10"]+my_pattern["usage_11_16"]+my_pattern["usage_17_22"]
  // const usage_23_4 = Math.round(my_pattern["usage_23_4"]/total_usage*1000)/10
  // const usage_5_10 = Math.round(my_pattern["usage_5_10"]/total_usage*1000)/10
  // const usage_11_16 = Math.round(my_pattern["usage_11_16"]/total_usage*1000)/10
  // const usage_17_22 = Math.round(my_pattern["usage_17_22"]/total_usage*1000)/10
  // // 이 도시의 전달 소비패턴
  // const city_pattern = data2[1]
  const usage_23_4 =
    chart_Data2 && chart_Data2["심야,새벽"] ? chart_Data2["심야,새벽"] : 0;
  const usage_5_10 =
    chart_Data2 && chart_Data2["오전"] ? chart_Data2["오전"] : 0;
  const usage_11_16 =
    chart_Data2 && chart_Data2["오후"] ? chart_Data2["오후"] : 0;
  const usage_17_22 =
    chart_Data2 && chart_Data2["저녁"] ? chart_Data2["저녁"] : 0;

  const data = {
    labels: ["오전", "오후", "저녁", "심야,새벽"],
    datasets: [
      {
        label: "비율%",
        data: [usage_5_10, usage_11_16, usage_17_22, usage_23_4],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "purple",
        ],
        // hoverOffset: 10
      },
    ],
  };

  const options = {
    responsive: true,
    // maintainAspectRatio: true,
    aspectRatio: 1.5,

    plugins: {
      legend: {
        // display: false,

        labels: {
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return <Doughnut data={data} options={options} className={style.pie_chart} />;
};

export default PieChart;
