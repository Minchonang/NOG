import { useEffect, useId, useRef, useState } from "react";
import { TfiReload } from "react-icons/tfi";

import common from "../common/css/common.module.css";
import style from "./css/CoinPred.module.css";

import Header from "../common/jsx/Header";
import BottomNav from "../common/jsx/BottomNav";
import Loading from "../common/jsx/LoadingNog";
import axios from "axios";
import Chart from "chart.js/auto";
import ChatBot from "../common/jsx/ChatBot";
import swal from "sweetalert";

function CoinPred() {
	const bot_NOG =
		"https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Fa8f094af-6e08-4df8-9b2b-f7f4eaa9e42d%2Ff7cdc086-7672-4a43-abb2-b9d65af8459e%2FUntitled.png?table=block&id=e8e6ed65-29ba-474f-8dc1-3ba04ddebe3d&spaceId=a8f094af-6e08-4df8-9b2b-f7f4eaa9e42d&width=2000&userId=6519112b-50fc-4c6c-b9e6-174d9c3dbad1&cache=v2";
	const animation_loading = `https://file.notion.so/f/f/a8f094af-6e08-4df8-9b2b-f7f4eaa9e42d/9dcba8da-1619-41c5-b6eb-c8cd9e5f14ab/Animation_loading.gif?id=454f4966-16c0-4a1a-a7cc-0aa13fa427bb&table=block&spaceId=a8f094af-6e08-4df8-9b2b-f7f4eaa9e42d&expirationTimestamp=1708416000000&signature=H9jZr4YgEX_685oImjncWz6XnyttZippJSYFpKDoxfc`;

	const [isLoading, setIsLoading] = useState(true);
	const [data_nowGraph, setData_nowGraph] = useState(null); // 현재 코인 그래프
	const [data_nowPrice, setData_nowPrice] = useState(null); // 현재 코인 시세
	const [data_predGraph, setData_predGraph] = useState(null); // 예측 코인 그래프
	const [data_predPrice, setData_predPrice] = useState(null); // 예측 코인 시세
	const [nowPrice, setNowPrice] = useState("-"); // 현재 가격
	const [predPrice, setPredPrice] = useState("");
	const [upDown, setUpDown] = useState("-"); // 5분 뒤 예측 증감
	const [isGraphLoading, setIsGraphLoading] = useState(true); // 그래프 불러오는 중
	// const [userId, setUserId] = useState("");

	const chartRef1 = useRef(null);

	const [selectedCoin, setSelectedCoin] = useState("KRW-ARDR");
	// 코인 변경 시 작동하는 함수
	const handleChangeCoin = (e) => {
		setSelectedCoin(e.target.value);
		setNowPrice("-");
		setUpDown("-");
		setData_nowGraph(null);
		setData_predGraph(null);
		setIsGraphLoading(true);
	};

	// 새로 데이터를 불러올 때
	const changeGraphLoading = () => {
		setNowPrice("-");
		setUpDown("-");
		setIsGraphLoading(true);
	};

	// 로딩 화면
	const showLoading = () => {
		// 3초 후에 로딩 완료
		const timeoutId = setTimeout(() => {
			setIsLoading(false);
		}, 3000);

		return () => {
			clearTimeout(timeoutId);
		};
	};

	useEffect(() => {
		showLoading();
		changeGraphLoading();
		swal(
			"안내",
			"코인 예측 가격 결과는 오로지 정보 제공 목적으로 제공되며, 이에 대해 피해가 발생하여도 당사는 책임을 지지 않습니다.",
			"info"
		);
	}, []);

	const userId = sessionStorage.getItem("user_id");

	// 코인 선택 안내 메시지 사라지기
	const [showSelectGuide, setShowSelectGuide] = useState(true);
	const handleGuide = (e) => {
		setShowSelectGuide(false);
	};

	// 1. flask로부터 데이터 받기 (now_coin_chart)
	const nowCoinChart = async (selectedCoin) => {
		console.log(`코인(${selectedCoin}) 데이터 가져오기 시작...`);
		try {
			const response = await axios.get(
				`http://3.38.50.14:5000/now_coin_chart?ago=2000&coinname=${selectedCoin}`
			);
			// 데이터 받기
			const data1 = response;
			setData_nowGraph(data1);
			setIsGraphLoading(false); // 그래프 내 로딩화면 끝
		} catch (error) {
			console.error("Error fetching data:", error.message);
		}
	};

	useEffect(() => {
		nowCoinChart(selectedCoin);
	}, [selectedCoin]);

	// 2. flask로부터 데이터 받기 (now_coin)
	const nowCoin = async (selectedCoin) => {
		try {
			const response = await axios.get(
				`http://3.38.50.14:5000/now_coin/?coinname=${selectedCoin}`
			);
			const data2 = response;
			setData_nowPrice(data2);
			// 현재 가격 추출
			if (data2.data) {
				const now_price = data2.data.map((entry) => entry.trade_price);
				setNowPrice(now_price);
				console.log("현재 코인 가격 ", now_price[0]);
			}
		} catch (error) {
			console.error("Error fetching data:", error.message);
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
			setData_predGraph(data3);
		} catch (error) {
			console.error("Error fetching data:", error.message);
		}
	};

	useEffect(() => {
		predCoinChart(selectedCoin);
	}, [selectedCoin]);

	// 4. flask로부터 데이터 받기 (pred_coin)
	const predCoin = async (selectedCoin) => {
		try {
			const response = await axios.get(
				`http://3.38.50.14:5000/pred_coin/?coin_full_name=${selectedCoin}`
			);
			const data4 = response;
			setData_predPrice(data4);
			// 예측 가격 추출
			if (data4.data) {
				const pred_price = data4.data[0];
				setPredPrice(pred_price);
				console.log("예측 코인 가격 ", pred_price);
			}
		} catch (error) {
			console.error("Error fetching data:", error.message);
		}
	};

	useEffect(() => {
		predCoin(selectedCoin);
	}, [selectedCoin]);

	// 차트그리기
	useEffect(() => {
		if (chartRef1.current && data_nowGraph) {
			// 차트가 그려질때 이전 차트 파괴
			if (chartRef1.current.chart) {
				chartRef1.current.chart.destroy();
			}
			const ctx = chartRef1.current.getContext("2d");

			// 추출데이터 정의
			const tradePrices = Object.values(data_nowGraph.data).map(
				(entry) => entry.trade_price
			);
			const predPrices = Object.values(data_predGraph.data);
			// predPrices의 시작 위치를 tradePrices의 길이에 맞추기
			const predStartIndex = tradePrices.length - predPrices.length;
			// 코인값 현재 보다 오르는지 내리는지 set해주기
			setUpDown(
				Math.round(predPrice - predPrices[predPrices.length - 1])
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
			);

			chartRef1.current.chart = new Chart(ctx, {
				type: "line",
				data: {
					labels: tradePrices.map((_, index) => index + 1), // 인덱스를 기반으로 라벨 생성
					datasets: [
						{
							label: "실제 거래 가격",
							data: tradePrices,
							backgroundColor: "rgba(75, 192, 192, 0.2)",
							borderColor: "rgba(75, 192, 192, 1)",
							borderWidth: 1,
							pointRadius: 0,
						},
						{
							label: "예측 가격",
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
							display: true, // 범주 숨김
							position: "bottom",
						},
					},
					scales: {
						x: {
							// max: predPrices.length,
							min: tradePrices.length - predPrices.length,
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
			console.log(
				"----- 예측 시세 완료 ----- ",
				predPrice - predPrices[predPrices.length - 1]
			);

			// 차트 업데이트
			chartRef1.current.chart.update();
		}
	}, [data_nowGraph]);

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<div className={common.background}>
					<Header sub_title={"오늘의 코인"} userId={userId} />
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
										{/* 아더를 제일 먼저 예측 처리하도록 flask에서 변경 필요 */}
										<option value="KRW-ARDR">아더</option>
										<option value="KRW-ETH">이더리움</option>
										<option value="KRW-ETC">이더리움클래식</option>
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
									<div
										className={style.selectGuide}
									>{`< 터치해서 다른 코인들도 확인해 보세요`}</div>
								)}
							</div>
							<div className={style.coinPrice}>{`${nowPrice
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`}</div>
							<div className={style.predReload}>
								<div className={style.predPrice}>
									<span>5분 뒤 예상: </span>
									<span
										className={`${
											Number(upDown) > 0 ? style.upPrice : style.downPrice
										}`}
									>
										{`${Number(upDown) > 0 ? "+" + upDown : upDown}원`}
									</span>
								</div>
								<TfiReload
									color="#0064ff"
									onClick={(e) => {
										changeGraphLoading();
										nowCoinChart(selectedCoin);
										predCoinChart(selectedCoin);
										nowCoin(selectedCoin);
										predCoin(selectedCoin);
									}}
								/>
							</div>
						</div>
						<div className={style.coinGraph_area}>
							{isGraphLoading ? (
								<>
									<div className={style.graphLoading_area}>
										<img
											className={style.loadingGif}
											src={animation_loading}
											alt="loadingAnimation"
										/>
										<div>그래프를 불러오는 중입니다...</div>
									</div>
								</>
							) : (
								<canvas className={style.coinGraph} ref={chartRef1}></canvas>
							)}
						</div>
						<div className={style.desc_area}>
							<div>{`[안내]`}</div>
							<div>{`코인 예측 가격 결과는 오로지 정보 제공 목적으로 제공되며,\n이에 대해 피해가 발생하여도 당사는 책임을 지지 않습니다.`}</div>
						</div>
						<div className={style.img_area}>
							<img src={bot_NOG} alt="botNOG" />
						</div>
					</div>
					<ChatBot />
					<BottomNav />
				</div>
			)}
		</>
	);
}

export default CoinPred;
