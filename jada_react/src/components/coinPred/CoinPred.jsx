import { useEffect, useRef, useState } from 'react';
import { TfiReload } from 'react-icons/tfi';

import common from '../common/css/common.module.css';
import style from './css/CoinPred.module.css';

import Header from '../common/jsx/Header';
import BottomNav from '../common/jsx/BottomNav';
import Loading from '../common/jsx/LoadingNog';
import axios from 'axios';
import Chart from 'chart.js/auto';

function CoinPred() {
   const bot_NOG =
      'https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Fa8f094af-6e08-4df8-9b2b-f7f4eaa9e42d%2Ff7cdc086-7672-4a43-abb2-b9d65af8459e%2FUntitled.png?table=block&id=e8e6ed65-29ba-474f-8dc1-3ba04ddebe3d&spaceId=a8f094af-6e08-4df8-9b2b-f7f4eaa9e42d&width=2000&userId=6519112b-50fc-4c6c-b9e6-174d9c3dbad1&cache=v2';
   const [isLoading, setIsLoading] = useState(true);
   const [Datasets1, setDatasets1] = useState(null);
   const [Datasets2, setDatasets2] = useState(null);
   const [Datasets3, setDatasets3] = useState(null);
   const [Datasets4, setDatasets4] = useState(null);
   const [nowPrice, setNowPrice] = useState('');
   const [predPrice, setPredPrice] = useState('');
   const chartRef1 = useRef(null);

   const [selectedCoin, setSelectedCoin] = useState('KRW-ETH');
   const handleChangeCoin = (e) => {
      setIsLoading(true); // 로딩 시작
      setSelectedCoin(e.target.value);
      setIsLoading(false); // 로딩 종료
   };

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

   // 코인 선택 안내 메시지 사라지기
   const [showSelectGuide, setShowSelectGuide] = useState(true);
   const handleGuide = (e) => {
      setShowSelectGuide(false);
   };

   // 페이지 새로고침 버튼
   const reload = () => {
      window.location.reload();
   };

   // 1. flask로부터 데이터 받기 (now_coin_chart)
   const nowCoinChart = async (selectedCoin) => {
      console.log('코인 데이터 가져오기 시작...');
      try {
         const response = await axios.get(`http://3.38.50.14:5000/now_coin_chart?ago=2000&coinname=${selectedCoin}`);
         // 데이터 받기
         const data1 = response;
         setDatasets1(data1);
         console.log('현재 코인 그래프 ', data1);
      } catch (error) {
         console.error('Error fetching data:', error.message);
      }
   };

   useEffect(() => {
      nowCoinChart(selectedCoin);
   }, [selectedCoin]);

   // 2. flask로부터 데이터 받기 (now_coin)
   const nowCoin = async (selectedCoin) => {
      try {
         const response = await axios.get(`http://3.38.50.14:5000/now_coin/?coinname=${selectedCoin}`);
         const data2 = response;
         setDatasets2(data2);
         console.log('현재 코인 가격 ', data2);
         // 현재 가격 추출
         if (data2.data) {
            const now_price = data2.data.map((entry) => entry.trade_price);
            setNowPrice(now_price);
            console.log('현재 코인 가격 ', now_price);
         }
      } catch (error) {
         console.error('Error fetching data:', error.message);
      }
   };

   useEffect(() => {
      nowCoin(selectedCoin);
   }, [selectedCoin]);

   // 3. flask로부터 데이터 받기 (pred_coin_chart)
   const predCoinChart = async (selectedCoin) => {
      try {
         const response = await axios.get(
            `http://3.38.50.14:5000/pred_coin_chart/?ago=2000&coin_full_name=${selectedCoin}`
         );
         const data3 = response;
         // const endvalue = data3[:]
         setDatasets3(data3);
         const keys = Object.keys(data3);
         const lastKey = keys[keys.length - 1];
         const lastValue = data3[lastKey];
         console.log('예측 코인 차트 ', data3);
      } catch (error) {
         console.error('Error fetching data:', error.message);
      }
   };

   useEffect(() => {
      predCoinChart(selectedCoin);
   }, [selectedCoin]);

   // 4. flask로부터 데이터 받기 (pred_coin)
   const predCoin = async (selectedCoin) => {
      try {
         const response = await axios.get(`http://3.38.50.14:5000/pred_coin/?coin_full_name=${selectedCoin}`);
         const data4 = response;
         setDatasets4(data4);
         console.log('예측 코인 가격 ', data4);
         // 예측 가격 추출
         if (data4.data) {
            const pred_price = data4.data[0];
            setPredPrice(pred_price);
            console.log('예측 코인 가격 ', pred_price);
         }
      } catch (error) {
         console.error('Error fetching data:', error.message);
      }
   };

   useEffect(() => {
      predCoin(selectedCoin);
   }, [selectedCoin]);

   // 차트그리기
   useEffect(() => {
      if (chartRef1.current && Datasets1) {
         // 차트가 그려질때 이전 차트 파괴
         if (chartRef1.current.chart) {
            chartRef1.current.chart.destroy();
         }
         const ctx = chartRef1.current.getContext('2d');

         // 추출데이터 정의
         const tradePrices = Object.values(Datasets1.data).map((entry) => entry.trade_price);
         const predPrices = Object.values(Datasets3.data);
         // predPrices의 시작 위치를 tradePrices의 길이에 맞추기
         const predStartIndex = tradePrices.length - predPrices.length;

         chartRef1.current.chart = new Chart(ctx, {
            type: 'line',
            data: {
               labels: tradePrices.map((_, index) => index + 1), // 인덱스를 기반으로 라벨 생성
               datasets: [
                  {
                     data: tradePrices,
                     backgroundColor: 'rgba(75, 192, 192, 0.2)',
                     borderColor: 'rgba(75, 192, 192, 1)',
                     borderWidth: 1,
                     pointRadius: 0,
                  },
                  {
                     data: predPrices,
                     backgroundColor: 'rgba(255, 99, 132, 0.2)',
                     borderColor: 'rgba(255, 99, 132, 1)',
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
         chartRef1.current.chart.data.datasets[1].data = predPrices.map((value, index) => ({
            x: predStartIndex + index + 1,
            y: value,
         }));

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
               <Header sub_title={'오늘의 코인'} />
               <div className={style.main_area}>
                  <div className={style.coinInfo_area}>
                     <div className={style.coinName_area}>
                        <div className={style.coinSelect_area}>
                           <select
                              name="selectCoin"
                              id="selectCoin"
                              value={selectedCoin}
                              onChange={handleChangeCoin}
                              onClick={handleGuide}
                           >
                              <option value="KRW-ETH">이더리움</option>
                              <option value="KRW-ETC">이더리움클래식</option>
                              <option value="KRW-ARDR">아더</option>
                              <option value="KRW-LSK">리스크</option>
                              <option value="KRW-MTL">메탈</option>
                              <option value="KRW-NEO">네오</option>
                              <option value="KRW-QTUM">퀀텀</option>
                              <option value="KRW-SNT">스테이터스네트워크토큰</option>
                              <option value="KRW-STEEM">스팀</option>
                              <option value="KRW-STORJ">스토리지</option>
                              <option value="KRW-WAVES">웨이브</option>
                              <option value="KRW-XEM">넴</option>
                              <option value="KRW-XLM">스텔라루멘</option>
                           </select>
                        </div>
                        {showSelectGuide && (
                           <div className={style.selectGuide}>{`< 터치해서 다른 코인들도 확인해 보세요.`}</div>
                        )}
                     </div>
                     <div className={style.coinPrice}>{`${nowPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}</div>
                     <div className={style.predReload}>
                        <div className={style.predPrice}>{`5분 뒤 예상: ${Math.round(predPrice)
                           .toString()
                           .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원`}</div>
                        <TfiReload
                           color="#0064ff"
                           onClick={(e) => {
                              nowCoinChart(selectedCoin);
                              predCoinChart(selectedCoin);
                              nowCoin(selectedCoin);
                              predCoin(selectedCoin);
                           }}
                        />
                     </div>
                  </div>
                  <div className={style.coinGraph_area}>
                     {' '}
                     <canvas className={style.coinGraph_area} ref={chartRef1}></canvas>
                  </div>
                  <div className={style.desc_area}>
                     <div>{`[안내]`}</div>
                     <div>{`코인 예측 가격 결과는 오로지 정보 제공 목적으로 제공되며,\n이에 대해 피해가 발생하여도 당사는 책임을 지지 않습니다.`}</div>
                  </div>
                  <div className={style.img_area}>
                     <img src={bot_NOG} alt="botNOG" />
                  </div>
               </div>
               <BottomNav />
            </div>
         )}
      </>
   );
}

export default CoinPred;
