import { useState } from "react";

import { NavLink } from "react-router-dom";
import common from "../common/css/common.module.css";
import style from "./css/EditUserInfo.module.css";
import { API_BASE_URL } from "../../App.js";

function EditUserInfo() {
	
	// 서버에서 받아온 유저 정보
	const [userId, setUserId] = useState('');
	const [userName, setUserName] = useState('');
	const [userEmail, setUserEmail] = useState('');
	const [userPhone, setUserPhone] = useState('');
	const [userAddress1, setUserAddress1] = useState('');
	const [userAddress2, setUserAddress2] = useState('');
	const [userAddress3, setUserAddress3] = useState('');
	const [userHouseNum, setUserHouseNum] = useState('');

	const serverlink = async (e) => {
	  // user_id를 가져오기
			const user_id = sessionStorage.getItem("user_id");

		// 주소 추가 필요
		const editUserDto = {
			user_id: user_id,
		};



		try {
			// 서버로 데이터 전송 - 경로 수정 필요
			const response = await fetch(
				`${API_BASE_URL}/api/userinfo/userfind`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(editUserDto),
				}
				
			);
			if (response.ok) {
				// // 서버 응답이 성공인 경우
				const result = await response.json();
				// 추출된 데이터 사용
				setUserId(result.userId);
				setUserName(result.name);
				setUserEmail(result.email);
				setUserPhone(result.phone);
				setUserAddress1(result.address1);
				setUserAddress2(result.address2);
				setUserAddress3(result.address3);
				setUserHouseNum(result.houseNum);
				console.log("회원 정보 조회 완료", result);
				// console.log("회원 정보 수정 완료");
				// alert("회원 정보가 수정되었습니다.");
			} else {
				console.log("회원 정보 수정 실패");
				alert("오류가 발생하였습니다.");
			}
		} catch (error) {
			console.error("서버 통신 오류", error);
		}
	}
	serverlink();


	const [editEmail, setEditEmail] = useState(false);
	const [newEmail, setNewEmail] = useState(userEmail); // 추후 서버 연결 시 변수 설정
	const editEmailBtn = () => {
		setEditEmail(true);
	};

	const [editPhone, setEditPhone] = useState(false);
	const [newPhone, setNewPhone] = useState(userPhone); // 추후 서버 연결 시 변수 설정
	const editPhoneBtn = () => {
		setEditPhone(true);
	};

	let houseNum = 4; // 임시로 넣은 가구원 수
	const [editHouseNum, setEditHouseNum] = useState(false);
	const [newHouseNum, setNewHouseNum] = useState(userHouseNum);
	const editHouseNumBtn = () => {
		setEditHouseNum(true);
	};


	const handleEdit = async (e) => {
		e.preventDefault();


		// 주소 추가 필요
		const editUserDto = {
			email: newEmail,
			phone: newPhone,
			houseNum: newHouseNum,
		};


		// newHouseNum이 숫자인지 검증
		const numberRegex = /^[0-9]+$/;
		if (!numberRegex.test(newHouseNum)) {
			alert("가구원 수는 숫자만 입력해야 합니다.");
			return;
		}

		// newPhone이 올바른 전화번호 형식인지 검증
		const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
		if (!phoneRegex.test(newPhone)) {
			alert("휴대폰 번호 형식이 맞지 않습니다.");
			return;
		}



		
		editEmailBtn(false);
		editPhoneBtn(false);
		editHouseNumBtn(false);
	};

	return (
		<>
			<div className={common.background}>
				<div className={style.main_area}>
					<div className={style.title_area}>
						<NavLink to="/">NOG</NavLink>
						<div>회원정보</div>
					</div>
					<div className={style.userId}>
						<div>{userId}</div>
					</div>
					<div className={style.info_main}>
						<div className={style.info_main_title}>기본 정보</div>
						<div className={style.info_main_detail}>
							<div>{userName}</div>
						</div>

						<div className={style.info_main_detail}>
							{editEmail ? (
								<input
									type="text"
									value={newEmail}
									onChange={(e) => setNewEmail(e.target.value)}
									className={style.input_new}
								/>
							) : (
								<div>{userEmail}</div>
							)}
							{/* <div>asdf3y92@gmail.com</div> */}
							<button onClick={editEmailBtn}>수정</button>
						</div>

						<div className={style.info_main_detail}>
							{editPhone ? (
								<input
									type="text"
									value={newPhone}
									onChange={(e) => setNewPhone(e.target.value)}
									className={style.input_new}
									maxLength="13"
								/>
							) : (
								<div>{userPhone}</div>
							)}
							{/* <div>010-3945-9475</div> */}
							<button onClick={editPhoneBtn}>수정</button>
						</div>
					</div>

					<div className={style.info_sub}>
						<div className={style.info_sub_title}>부가 정보</div>
						<div className={style.info_sub_detail}>
							<div>{userAddress1}{userAddress2}{userAddress3}</div>
							<button>수정</button>
						</div>

						<div className={style.info_sub_detail}>
							<div style={{ marginRight: "5px" }}>가구원 수: </div>
							{editHouseNum ? (
								<input
									type="number"
									value={newHouseNum}
									onChange={(e) => setNewHouseNum(e.target.value)}
									className={`${style.input_new} ${style.input_newHouseNum}`}
									maxLength="2"
								></input>
							) : (
								<div>{userHouseNum}</div>
							)}
							<div>명</div>
							{/* <div>가구원 수: {houseNum}명</div> */}
							<button onClick={editHouseNumBtn}>수정</button>
						</div>
					</div>

					{/* 정보 수정 완료 */}
					<div className={common.btn_area}>
						<button className={common.themeBgrColor} onClick={handleEdit}>
							확인
						</button>
					</div>

					{/* 회원탈퇴 */}
					<div className={style.delete_account}>
						<div>회원탈퇴</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default EditUserInfo;
