import { NavLink } from "react-router-dom";
import common from "../common/css/common.module.css";
import { API_BASE_URL } from "../../App.js";

function SampleComp() {
	const go_login = () => {
		window.location.href = "/login";
	};
	const go_userInfo = () => {
		window.location.href = "/edit_userinfo";
	};
	const go_checkUser = () => {
		window.location.href = "/check_user";
	};
	const go_logout = async(e) => {
		e.preventDefault();
		// 세션 스크립트: 로그아웃 시 세션 지우기
		const user_id = sessionStorage.getItem("user_id");

		try {
			const response = await fetch(`${API_BASE_URL}/api/userinfo/logout`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ user_id }),
			});
		
			if (response.ok) {
				sessionStorage.removeItem("user_id");
				console.log("로그아웃 성공");
				window.location.href = "/";
			} else {
				console.log("로그아웃 실패");
			}
		} catch (error) {
			console.error("서버 통신 오류", error);
		}

		
	};
	return (
		<>
			<div>
				<button onClick={go_login}>로그인</button>
				<button onClick={go_userInfo}>회원정보</button>
				<button onClick={go_checkUser}>본인확인</button>
				<button onClick={go_logout}>로그아웃</button>

			</div>
		</>
	);
}

function Index() {
	return (
		<div>
			<div className={common.background}>
				<div className={common.main_area}>
					<NavLink to="/" className={common.title_area}>
						NOG
					</NavLink>
					<SampleComp />
				</div>
			</div>
		</div>
	);
}

export default Index;
