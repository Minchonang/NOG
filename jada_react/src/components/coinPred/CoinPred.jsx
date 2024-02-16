import { useEffect, useRef, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { BiChevronLeft } from "react-icons/bi";
import { TbReload } from "react-icons/tb";
import { TfiReload } from "react-icons/tfi";

import common from "../common/css/common.module.css";
import style from "./css/CoinPred.module.css";

import Header from "../common/jsx/Header";
import BottomNav from "../common/jsx/BottomNav";
import Loading from "../common/jsx/LoadingNog";

function CoinPred() {
	// 로딩 화면
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		setIsLoading(true);
		const timeoutId = setTimeout(() => {
			setIsLoading(false);
		}, 1000);

		return () => {
			clearTimeout(timeoutId);
		};
	}, []);

	// select 길이 자동 조절
	const [selectedCoin, setSelectedCoin] = useState("");

	const coinNameLength = useRef();
	useEffect(() => {
		if (coinNameLength.current) {
			const nameWidth = coinNameLength.current.scrollWidth;
			coinNameLength.current.style.width = `${nameWidth}px`;
		}
	}, []);

	// 코인 선택 안내 메시지 사라지기
	const [showSelectGuide, setShowSelectGuide] = useState(true);
	const handleGuide = (e) => {
		setSelectedCoin(e.target.value);
		setShowSelectGuide(false);
	};

	// 페이지 새로고침 버튼
	const reload = () => {
		window.location.reload();
	};

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<div className={common.background}>
					<Header sub_title={"오늘의 코인"} />
					<div className={style.main_area}>
						<div className={style.coinInfo_area}>
							<div className={style.coinName_area}>
								{/* <BiChevronDown color="#0064ff" className={style.downMarker}/> */}
								<div className={style.coinSelect_area}>
									<select
										name="selectCoin"
										id="selectCoin"
										ref={coinNameLength}
										onChange={(e) => setSelectedCoin(e.target.value)}
										onClick={handleGuide}
									>
										<option value="이더리움">이더리움</option>
										<option value="아더">아더</option>
										<option value="이더리움클래식">이더리움클래식</option>
										<option value="리스크">리스크</option>
										<option value="메탈">메탈</option>
										<option value="네오">네오</option>
										<option value="퀀텀">퀀텀</option>
										<option value="스테이터스네트워크토큰">
											스테이터스네트워크토큰
										</option>
										<option value="스팀">스팀</option>
										<option value="스토리지">스토리지</option>
										<option value="웨이브">웨이브</option>
										<option value="넴">넴</option>
										<option value="스텔라루멘">스텔라루멘</option>
									</select>
								</div>
								{showSelectGuide && (
									<div
										className={style.selectGuide}
									>{`다른 코인도 확인해 보세요.`}</div>
								)}
							</div>
							<div className={style.coinPrice}>{`10,000,000원`}</div>
							<div className={style.predReload}>
								<div
									className={style.predPrice}
								>{`11,000,000원 (5분 뒤 예상)`}</div>
								{/* <div>새로고침</div> */}
								<TfiReload color="#0064ff" onClick={reload} />
							</div>
						</div>
						<div className={style.coinGraph_area}></div>
					</div>
					<BottomNav />
				</div>
			)}
		</>
	);
}

export default CoinPred;
