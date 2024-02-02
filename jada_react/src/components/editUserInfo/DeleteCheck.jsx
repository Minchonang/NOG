import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import common from "../common/css/common.module.css";
import style from "./css/DeleteCheck.module.css";
import BottomNav from "../common/jsx/BottomNav";

function DeleteCheck() {
	const activeUser = true;
	
	// 이전 페이지로 돌아가는 기능
	const navigate = useNavigate();
	const goBack = () => {
		navigate(-1); 
	};

	const [isCheck, setIsCheck] = useState(false);
	const isPass = () => {
		if (!isCheck) {
			alert("안내 사항 내용에 동의를 해주세요.");
		}
	};

	return (
		<>
			<div className={common.background}>
				<div className={style.title_area}>
					<NavLink to="/">NOG</NavLink>
					<div>회원탈퇴</div>
				</div>
				<div className={style.main_area}>
					<div className={style.topGuide_area}>
						<li> 회원탈퇴를 하기 전에 안내 사항을 꼭 확인해 주세요.</li>
					</div>
					<div className={style.info_main}>
						<div className={style.info_main_title}>아이디 복구 불가 안내</div>
						<div className={style.info_main_detail}>
							<div>
								사용하고 계신 아이디(<span className={style.userId}>test2</span>
								)를 탈퇴하시면 복구가 불가하오니 신중하게 선택하시기 바랍니다.
							</div>
						</div>
					</div>

					<div className={style.info_sub}>
						<div className={style.info_sub_title}>
							회원정보/개인형 서비스 이용 기록 삭제
						</div>
						<div className={style.info_sub_detail}>
							<div>
								회원 정보 및 개인형 서비스 이용기록은 모두 삭제되며, 삭제된
								데이터는 복구되지 않습니다.
							</div>
							<div className={style.checkbox_area}>
								<input
									id="confirm_msg"
									type="checkbox"
									checked={isCheck}
									onChange={(e) => setIsCheck(e.target.checked)}
								/>
								<label htmlFor="confirm_msg">
									위 내용을 모두 확인하였으며, 이에 동의합니다.
								</label>
							</div>
						</div>
					</div>

					{/* 정보 수정 완료 */}
					<div className={`${common.btn_area} ${style.deleteBtn_area}`}>
						<button onClick={goBack}>돌아가기</button>
						<button className={common.themeBgrColor} onClick={isPass}>
							회원탈퇴
						</button>
					</div>
				</div>
				<BottomNav activeUser={activeUser}/>
			</div>
		</>
	);
}

export default DeleteCheck;
