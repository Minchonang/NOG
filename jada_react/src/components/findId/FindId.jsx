import { useState } from "react";
import { NavLink } from "react-router-dom";
import common from "../common/css/common.module.css";
import style from "./css/FindId.module.css";
import { API_BASE_URL } from "../../App.js";

function FindId() {
	const [userName, setUserName] = useState("");
	const [userEmail, setUserEmail] = useState("");
	const [emailAuth, setEmailAuth] = useState("");

	return (
		<>
			<div className={common.background}>
				<div className={common.main_area}>
					<div className={common.title_area}>
						<NavLink to="/">Jada</NavLink>
					</div>
					<label className={style.guide_label}>
						등록된 이름, 이메일을 입력하세요.
					</label>
					<div className={common.input_area}>
						<input
							type="text"
							value={userName}
							onChange={(e) => setUserName(e.target.value)}
							placeholder="이름 입력"
							maxLength="20"
						/>
						<div className={style.inputEmail_area}>
							<input
								type="text"
								value={userEmail}
								onChange={(e) => setUserEmail(e.target.value)}
								placeholder="이메일 입력"
								maxLength="25"
							/>
							<button className={common.themeBgrColor}>인증하기</button>
						</div>
						<input
							type="text"
							value={emailAuth}
							onChange={(e) => setEmailAuth(e.target.value)}
							placeholder="인증번호"
							maxLength="8"
						/>
					</div>
					<div className={common.btn_area}>
						<button className={common.themeBgrColor}>아이디 찾기</button>
					</div>
					<div className={style.findPw_area}>
						<NavLink to="/find_pw">비밀번호를 잊으셨나요?</NavLink>
					</div>
				</div>
			</div>
		</>
	);
}
export default FindId;
