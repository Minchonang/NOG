import { useEffect, useState, useRef } from "react";

import common from "../common/css/common.module.css";
import style from "./css/CoinPred.module.css";

import Header from "../common/jsx/Header";
import BottomNav from "../common/jsx/BottomNav";
import Loading from "../common/jsx/LoadingNog";
import axios from "axios";
import Chart from "chart.js/auto";

function CoinPred() {
  const [isLoading, setIsLoading] = useState(true);
  const [Datasets1, setDatasets1] = useState(null);
  const [Datasets2, setDatasets2] = useState(null);
  const [Datasets3, setDatasets3] = useState(null);
  const [Datasets4, setDatasets4] = useState(null);
  const [nowPrice, setNowPrice] = useState(null);
  const [predPrice, setPredPrice] = useState(null);
  const chartRef1 = useRef(null);

  useEffect(() => {
    // 로딩 시작
    setIsLoading(true);

    // 2초 후에 로딩 완료
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // 1. flask로부터 데이터 받기 (now_coin_chart)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://43.203.120.82:5000/now_coin_chart?ago=2000&coinname=KRW-LSK"
        );
        // 데이터 받기
        const data1 = response;
        setDatasets1(data1);
        console.log("data1 ", data1);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, []);

  // 2. flask로부터 데이터 받기 (now_coin)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://43.203.120.82:5000/now_coin/?coinname=KRW-ETH"
        );
        const data2 = response;
        setDatasets2(data2);
        console.log("data2 ", data2);
        // 현재 가격 추출
        if (data2.data) {
          const now_price = data2.data.map((entry) => entry.trade_price);
          setNowPrice(now_price);
          console.log("now_price ", now_price);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, []);

  // 3. flask로부터 데이터 받기 (pred_coin_chart)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://43.203.120.82:5000/pred_coin_chart/?ago=2000&coin_full_name=KRW-LSK"
        );
        const data3 = response;
        setDatasets3(data3);
        console.log("data3 ", data3);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, []);
  // 4. flask로부터 데이터 받기 (pred_coin)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://43.203.120.82:5000/pred_coin/?coin_full_name=KRW-ETH"
        );
        const data4 = response;
        setDatasets4(data4);
        console.log("data4 ", data4);
        // 예측 가격 추출
        if (data4.data) {
          const pred_price = data4.data[0];
          setPredPrice(pred_price);
          console.log("pred_price ", pred_price);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, []);

  // 차트그리기
  useEffect(() => {
    if (chartRef1.current && Datasets1) {
      // 차트가 그려질때 이전 차트 파괴
      if (chartRef1.current.chart) {
        chartRef1.current.chart.destroy();
      }
      const ctx = chartRef1.current.getContext("2d");

      // 추출데이터 정의
      const tradePrices = Object.values(Datasets1.data).map(
        (entry) => entry.trade_price
      );
      const predPrices = Object.values(Datasets3.data);
      // predPrices의 시작 위치를 tradePrices의 길이에 맞추기
      const predStartIndex = tradePrices.length - predPrices.length;

      chartRef1.current.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: tradePrices.map((_, index) => index + 1), // 인덱스를 기반으로 라벨 생성
          datasets: [
            {
              data: tradePrices,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
              pointRadius: 0,
            },
            {
              data: predPrices,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
              pointRadius: 0,
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
      // predPrices의 index 값이 tradePrices의 length - predPrices의 length 만큼 더해지도록 수정
      chartRef1.current.chart.data.datasets[1].data = predPrices.map(
        (value, index) => ({
          x: predStartIndex + index + 1,
          y: value,
        })
      );

      // 차트 업데이트
      chartRef1.current.chart.update();
    }
  }, [Datasets1]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={common.background}>
          <Header sub_title={"쉼터"} />
          <div className={common.main_area}>
            <div>또 너 코인하니?</div>
            <div>
              <canvas className={style.canvas1} ref={chartRef1}></canvas>
            </div>
            <div>현재가격 : {nowPrice}</div>
            <div>예측가격 : {predPrice}</div>
          </div>
          <BottomNav />
        </div>
      )}
    </>
  );
}

export default CoinPred;
