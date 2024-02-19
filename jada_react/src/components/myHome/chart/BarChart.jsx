import React from "react";
import { Bar } from "react-chartjs-2";
import style from "./css/MyChart.module.css";

const BarChart = ({ data6 }) => {
  const my_total_usage =
    data6 && data6[0]["my_total_usage"] ? data6[0]["my_total_usage"] : 0;

  const my_total_usage_last =
    data6 && data6[0]["my_total_usage_last"]
      ? data6[0]["my_total_usage_last"]
      : 0;

  const average_total_usage =
    data6 && data6[0]["average_total_usage"]
      ? data6[0]["average_total_usage"]
      : 0;

  const city_month_total_last_year =
    data6 && data6[1]["city_month_total_last_year"]
      ? data6[1]["city_month_total_last_year"]
      : 0;

  const user_month_total_last_year =
    data6 && data6[1]["user_month_total_last_year"]
      ? data6[1]["user_month_total_last_year"]
      : 0;

  const city_average_daily_usage =
    data6 && data6[1]["city_average_daily_usage"]
      ? data6[1]["city_average_daily_usage"]
      : 0;

  const labels = ["이번 달", "지난 달", "전년동월"];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "사용자",
        data: [my_total_usage, my_total_usage_last, user_month_total_last_year],
        backgroundColor: [
          "rgba(226,165,161)",
          "rgba(226,165,161)",
          "rgba(226,165,161)",
        ],
        borderColor: [
          "rgb(226,165,161)",
          "rgb(226,165,161)",
          "rgb(226,165,161)",
        ],
        borderWidth: 2,
      },
      {
        label: "지역주민",
        data: [
          // 이달
          city_average_daily_usage,
          // 저번달
          average_total_usage,
          // 작년
          city_month_total_last_year,
        ],
        backgroundColor: [
          "rgba(192,214,228)",
          "rgba(192,214,228)",
          "rgba(192,214,228)",
        ],
        borderColor: [
          "rgb(192,214,228)",
          "rgb(192,214,228)",
          "rgb(192,214,228)",
        ],
        borderWidth: 2,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14.6,
            family: "Godo",
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 15,
            family: "Godo",
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 15,
            family: "Godo",
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} className={style.bar_chart} />;
};

export default BarChart;
