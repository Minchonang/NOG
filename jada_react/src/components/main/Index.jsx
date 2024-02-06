// import { NavLink } from "react-router-dom";
import { useState } from "react";
import { API_BASE_URL } from "../../App.js";
import { FaArrowDown } from "react-icons/fa";

import BottomNav from "../common/jsx/BottomNav";
import Header from "../common/jsx/Header";
import ChatBot from "../common/jsx/ChatBot.jsx";

import style from "./css/Index.module.css";
import common from "../common/css/common.module.css";
// function SampleComp() {
// 	const go_login = () => {
// 		window.location.href = "/login";
// 	};
// 	const go_userInfo = () => {
// 		window.location.href = "/edit_userinfo";
// 	};
// 	const go_checkUser = () => {
// 		window.location.href = "/check_user";
// 	};
// 	const go_logout = async (e) => {
// 		e.preventDefault();
// 		// 세션 스크립트: 로그아웃 시 세션 지우기
// 		const user_id = sessionStorage.getItem("user_id");

// 		try {
// 			const response = await fetch(`${API_BASE_URL}/api/userinfo/logout`, {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({ user_id }),
// 			});

// 			if (response.ok) {
// 				sessionStorage.removeItem("user_id");
// 				console.log("로그아웃 성공");
// 				window.location.href = "/home";
// 			} else {
// 				console.log("로그아웃 실패");
// 			}
// 		} catch (error) {
// 			console.error("서버 통신 오류", error);
// 		}
// 	};
// 	return (
// 		<>
// 			{/* <div>
//         <button onClick={go_login}>로그인</button>
//         <button onClick={go_userInfo}>회원정보</button>
//         <button onClick={go_checkUser}>본인확인</button>
//         <button onClick={go_logout}>로그아웃</button>
//       </div> */}
// 		</>
// 	);
// }

function Index() {
	const activeData = true;
	const [userId, setUserId] = useState("");

	const serverLink = async (e) => {
		// user_id를 가져오기
		const user_id = sessionStorage.getItem("user_id");

		// 주소 추가 필요
		const editUserDto = {
			user_id: user_id,
		};

		try {
			// 서버로 데이터 전송 - 경로 수정 필요
			const response = await fetch(`${API_BASE_URL}/api/userinfo/userfind`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(editUserDto),
			});
			if (response.ok) {
				// // 서버 응답이 성공인 경우
				const result = await response.json();
				// 추출된 데이터 사용
				setUserId(result.userId);
			} else {
				console.log("회원 정보 조회 실패");
				alert("오류가 발생하였습니다.");
			}
		} catch (error) {
			console.error("서버 통신 오류", error);
		}
	};

	serverLink();

	return (
		<div className={common.background}>
			<Header />
			<div className={common.main_area}>
				{/* <NavLink to="/" className={common.title_area}>
          NOG
        </NavLink> */}
				{/* <SampleComp /> */}
				<div className={style.userElectricityBill}>
					이번 달 {userId}님의 예상 전기 요금은
					<br />
					53,000원 입니다.
				</div>
				<div className={style.nextbar}>
					<FaArrowDown className={style.arrowIcon} />
					분석 결과 보기
					<FaArrowDown className={style.arrowIcon} />
				</div>

				<div className={style.graph_box}>
					<div className={style.graph_title}>그래프 1</div>
					<div>그래프 1</div>
				</div>
				<div className={style.graph_box}>
					<div className={style.graph_title}>그래프 2</div>
					<div>그래프 2</div>
				</div>
				<div className={style.graph_box}>
					<div className={style.graph_title}>그래프 3</div>
					<div>그래프 3</div>
				</div>
				<ChatBot/>
				<BottomNav activeData={activeData} />
			</div>
		</div>
	);
}

export default Index;
