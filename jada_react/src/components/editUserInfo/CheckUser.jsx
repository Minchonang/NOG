import { useState } from "react";
import { NavLink } from "react-router-dom";

import common from "../common/css/common.module.css";
// import style from "./css/FindId.module.css";
import { API_BASE_URL } from "../../App.js";

function CheckUser() {
	const [userPwd, setUserPwd] = useState("");

	const checkUserPwd = async (e) => {
		e.preventDefault();

		const requestData = {
			
			id : sessionStorage.getItem("user_id"),
			password: userPwd,
		};
		try {
			const response = await fetch(`${API_BASE_URL}/api/userinfo/check-password`, {
				method: "POST",
				credentials: 'include', // 쿠키를 요청 헤더에 포함하기 위한 설정
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "ip: 8080",
				},
				body: JSON.stringify(requestData),
			});

			if (response.ok) {
				// const data = await response.json();
				console.log(requestData.id);
				console.log("비밀번호 일치:");
				alert("본인 확인이 완료되었습니다.");
				window.location.href = "/edit_userinfo";
			} else {
				console.log(requestData.id);
				console.log("로그인 실패:", response.status);
				const errorMessage = await response.text();
				// console.log(errorMessage)
				alert(errorMessage);
			}
		} catch (error) {
			console.log(requestData.id);
			console.error("로그인 중 오류 발생:", error);
			alert(`통신 오류: ${error}`);
		}
	};
	return (
		<>
			<div className={common.background}>
				<div className={common.main_area}>
					<div className={common.title_area}>
						<NavLink to="/">NOG</NavLink>
					</div>
					<label className={common.guide_label}>
						회원님의 비밀번호를 다시 한번 확인합니다.
					</label>
					<div className={common.input_area}>
						<input
							type="text"
							value={userPwd}
							onChange={(e) => setUserPwd(e.target.value)}
							placeholder="비밀번호 입력"
							maxLength="25"
						/>
					</div>
					<div className={common.btn_area}>
						<button className={common.themeBgrColor} onClick={checkUserPwd}>왁인</button>
					</div>
				</div>
			</div>
		</>
	);
}

export default CheckUser;
