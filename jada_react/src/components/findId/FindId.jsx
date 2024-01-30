import { NavLink } from "react-router-dom";
import common from "../common/css/common.module.css";
import style from "./css/FindId.module.css";

function FindId() {
	return (
		<>
			<div className={common.background}>
				<div className={common.main_area}>
					<div className={common.title_area}>
						<NavLink to="/">Jada</NavLink>
					</div>
					<label className={style.guide_label}>
						등록된 이름, 전화번호, 이메일을 입력하세요.
					</label>
					<div className={common.input_area}>
						<input type="text" placeholder="이름 입력" maxLength="20" />
						<input type="number" placeholder="전화번호 입력" maxLength="11" />
						<input type="text" placeholder="이메일 입력" maxLength="25" />
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
