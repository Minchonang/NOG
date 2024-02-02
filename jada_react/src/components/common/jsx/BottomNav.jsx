import { NavLink } from "react-router-dom";
import common from "../css/common.module.css";
import bottom from "../css/BottomNav.module.css";

import icon_data from "../svg/icon_data.svg";
import icon_home from "../svg/icon_home.svg";
import icon_user from "../svg/icon_user.svg";

import active_data from "../svg/activeicon_data.svg";
import active_home from "../svg/activeicon_home.svg";
import active_user from "../svg/activeicon_user.svg";

function BottomNav({ activeHome, activeData, activeUser }) {
	const goHome = () => {
		window.location.href = "/"; // 집 제어 페이지 제작 시 링크 변경
	};
	const goData = () => {
		window.location.href = "/";
	};
	const goUserCheck = () => {
		window.location.href = "/check_user";
	};
	return (
		<>
			<div className={bottom.background}>
				<div className={bottom.main_area}>
					<div className={bottom.nav_btn} onClick={goHome}>
						<img src={activeHome ? active_home : icon_home} alt="" />
						<div>우리집</div>
					</div>
					<div className={bottom.nav_btn} onClick={goData}>
						<img src={activeData ? active_data : icon_data} alt="" />
						<div>분석</div>
					</div>

					<div className={bottom.nav_btn} onClick={goUserCheck}>
						<img src={activeUser ? active_user : icon_user} alt="" />
						<div>내 정보</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default BottomNav;
