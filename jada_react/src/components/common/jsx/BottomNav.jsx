import bottom from "../css/BottomNav.module.css";
import icon_data from "../img/bottomNav/icon_data.svg";
import icon_home from "../img/bottomNav/icon_home.svg";
import icon_user from "../img/bottomNav/icon_user.svg";
import icon_activeData from "../img/bottomNav/activeicon_data.svg";
import icon_activeHome from "../img/bottomNav/activeicon_home.svg";
import icon_activeUser from "../img/bottomNav/activeicon_user.svg";

function BottomNav({ activeHome, activeData, activeUser, admin }) {
	const goHome = () => {
		window.location.href = "/homeControl"; // 집 제어 페이지 제작 시 링크 변경
	};
	const goData = () => {
		window.location.href = "/analysis";
	};
	const goUserCheck = () => {
		window.location.href = "/check_user";
	};
	return (
		<>
			<div className={`${bottom.background} ${!admin ? null : bottom.hidden}`}>
				<div className={bottom.main_area}>
					<div className={bottom.nav_btn} onClick={goHome}>
						<img src={activeHome ? icon_activeHome : icon_home} alt="" />
						<div>우리집</div>
					</div>
					<div className={bottom.nav_btn} onClick={goData}>
						<img src={activeData ? icon_activeData : icon_data} alt="" />
						<div>리포트</div>
					</div>

					<div className={bottom.nav_btn} onClick={goUserCheck}>
						<img src={activeUser ? icon_activeUser : icon_user} alt="" />
						<div>내정보</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default BottomNav;
