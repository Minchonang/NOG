import React from "react";
import { Doughnut } from "react-chartjs-2";
import style from "./css/MyChart.module.css";

const DoughnutChart = ({ data1 }) => {
  const my = data1[1];
  const percentage = data1[2];

  const total = data1[0] * 1 - data1[1] <= 0 ? 0 : data1[0] * 1 - data1[1];

  const doughnutData = {
    labels: [`이달 사용량 ${my}kWh`, `지역평균 ${data1[0]}kWh`],
    datasets: [
      {
        data: [my, total],
        backgroundColor: ["rgb(250, 185, 33)", "gray"],
        hoverBackgroundColor: ["red", "black"],
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    aspectRatio: 1 | 2,
    borderColor: "white",
    borderWidth: 10,

    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: 152 + "kw",
        font: {
          size: 10,
        },
      },
      tooltips: {
        enabled: false, // 툴팁 비활성화
      },
    },
    maintainAspectRatio: true,
    cutoutPercentage: 400,
    // animation: true,
    rotation: 290,
    circumference: 45 * Math.PI,
  };

  return (
    <div className={style.doughnut_chart_box}>
      <Doughnut
        data={doughnutData}
        options={doughnutOptions}
        className={style.doughnut_chart}
      />
      <span className={style.doughnut_value}>{my ? my : 0}kWh</span>
      <span className={style.doughnut_percentage}>
        {percentage ? "저번 달 대비 " + percentage : 0}%
      </span>
    </div>
  );
};

export default DoughnutChart;
