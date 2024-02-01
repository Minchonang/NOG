import { NavLink } from "react-router-dom";
import common from "../css/common.module.css";
import bottom from "../css/BottomNav.module.css";

function BottomNav() {
	const img =
		"https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Fa8f094af-6e08-4df8-9b2b-f7f4eaa9e42d%2F07e61c0b-34f6-41c8-945f-0c7b5578a826%2FUntitled.png?table=block&id=04d507f7-44d0-4103-b73f-74ccbd2f48e4&spaceId=a8f094af-6e08-4df8-9b2b-f7f4eaa9e42d&width=2000&userId=6519112b-50fc-4c6c-b9e6-174d9c3dbad1&cache=v2";
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
						<img src={img} alt=""></img>
						<div>우리집</div>
					</div>
					<div className={bottom.nav_btn} onClick={goData}>
						<img src={img} alt=""></img>
						<div>분석</div>
					</div>

					<div className={bottom.nav_btn} onClick={goUserCheck}>
						<img src={img} alt=""></img>
						<div>내정보</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default BottomNav;
