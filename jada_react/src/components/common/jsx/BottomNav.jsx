import { NavLink } from "react-router-dom";
import common from "../css/common.module.css";
import bottom from "../css/BottomNav.module.css";
import icon_data from "../svg/icon_data.svg";
import icon_home from "../svg/icon_home.svg"
import icon_user from "../svg/icon_user.svg"

function BottomNav() {
	const goHome = () => {
		window.location.href = "/";
	};
	const goData = () => {
		window.location.href = "/"; // 데이터 분석 페이지 제작 시 링크 변경
	};
	const goUserCheck = () => {
		window.location.href = "/check_user";
	};
	return (
		<>
			<div className={bottom.background}>
				<div className={bottom.main_area}>
					<div className={bottom.nav_btn} onClick={goHome}>
						<img src={icon_home} alt=""></img>
						<div>우리집</div>
					</div>
					<div className={bottom.nav_btn} onClick={goData}>
						<img src={icon_data} alt=""></img>
						<div>분석</div>
					</div>

					<div className={bottom.nav_btn} onClick={goUserCheck}>
						<img src={icon_user} alt=""></img>
						<div>내정보</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default BottomNav;
