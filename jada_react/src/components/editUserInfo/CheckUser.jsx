import { useState } from "react";
import { NavLink } from "react-router-dom";
import style from "./css/CheckUser.module.css";
import common from "../common/css/common.module.css";
// import style from "./css/FindId.module.css";
import { API_BASE_URL } from "../../App.js";

function CheckUser() {
	const [userPwd, setUserPwd] = useState("");

	const checkUserPwd = async (e) => {
		e.preventDefault();

		const requestData = {
			passowrd: userPwd,
		};
		try {
			const response = await fetch(`${API_BASE_URL}/api/userinfo/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "ip: 8080",
					// "Content-Type": "application/x-www-form-urlencoded",
				},
				body: JSON.stringify(requestData),
			});

			if (response.ok) {
				// const data = await response.json();
				console.log("비밀번호 일치:");
				alert("본인 확인이 완료되었습니다.");
				window.location.href = "/edit_userinfo";
			} else {
				console.log("로그인 실패:", response.status);
				const errorMessage = await response.text();
				alert(errorMessage);
			}
		} catch (error) {
			console.error("로그인 중 오류 발생:", error);
			alert("통신 오류");
		}
	};
	return (
		<>
			<div className={common.background}>
				<div className={common.main_area}>
					<div className={common.title_area}>
						<NavLink to="/">NOG</NavLink>
					</div>
					<label className={style.guide_label}>
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
