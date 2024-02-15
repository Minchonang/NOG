import { useEffect, useState } from "react";

import common from "../common/css/common.module.css";
import style from "./css/CoinPred.module.css";

import Header from "../common/jsx/Header";
import BottomNav from "../common/jsx/BottomNav";
import Loading from "../common/jsx/LoadingNog";

function CoinPred() {
	const [isLoading, setIsLoading] = useState(true);

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
	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<div className={common.background}>
					<Header sub_title={"쉼터"} />
					<div className={common.main_area}>
                  <div>또 너 코인하니?</div>
               </div>
					<BottomNav />
				</div>
			)}
		</>
	);
}

export default CoinPred;
