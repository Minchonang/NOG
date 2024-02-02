import React, { useEffect, useRef, useState } from "react";

import styles from "./css/Join.module.css";
import common from "../common/css/common.module.css";
import { API_BASE_URL } from "../../App.js";
import BottomNav from "../common/jsx/BottomNav.jsx";

function Join() {
	const idRef = useRef();
	useEffect(() => {
		setTimeout(() => {
			if (idRef.current) {
				idRef.current.focus();
			}
		}, 500);
	}, []);

	const [formData, setFormData] = useState({
		email: "",
		id: "",
		password: "",
		passwordConfirm: "",
		name: "",
		phone: "",
		address: "",
		house_num: "",
		emailauth: "",
		// house_square:''
	});

	const [authkey, setAuthkey] = useState("");
	const [isVerified, setIsVerified] = useState(false); // 인증 확인 상태. 초기값은 false.

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleVerify = (e) => {
		e.preventDefault();
		if (!authkey) {
			alert("인증번호를 먼저 요청하세요.");
			return;
		}
		if (authkey === formData.emailauth) {
			setIsVerified(true);
			alert("인증이 확인되었습니다.");
		} else {
			setIsVerified(false);
			alert("인증번호가 일치하지 않습니다.");
		}
	};

	const handleJoin = async (e) => {
		e.preventDefault();

		if (!isVerified) {
			alert("이메일 인증을 먼저 완료하세요.");
			return;
		}

		try {
			// JoinUserDto와 유사한 구조를 가진 데이터로 변환
			const joinUserDto = {
				email: formData.email,
				id: formData.id,
				password: formData.password,
				name: formData.name,
				phone: formData.phone,
				address: formData.address,
				houseNum: formData.house_num,
				// houseSquare: formData.house_square, // 만약 사용할 경우
			};

			// 서버로 데이터 전송
			const response = await fetch(`${API_BASE_URL}/api/userinfo/join`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(joinUserDto),
			});

			if (response.ok) {
				console.log("회원가입 성공");
				alert("회원가입 성공");
				window.location.href = "/";
			} else {
				console.error("회원가입 실패");
				alert("회원가입 실패");
			}
		} catch (error) {
			console.error("서버 통신 오류", error);
		}
	};

	// 이메일인증
	const sendEmail = (e) => {
		e.preventDefault();
		console.log(formData.email);
		const data = {
			EMAIL: formData.email,
		};

		fetch(`${API_BASE_URL}/PwFind/Email`, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
			mode: "cors",
		})
			.then((res) => res.json())
			.then((json) => {
				setAuthkey(json.AUTHKEY);
				console.log(json.AUTHKEY); // Use setNumber to update the state
			})
			.catch((error) => {
				console.error("Error fetching email:", error);
			});
	};

	// id 중복체크
	const handleDuplicateCheck = async () => {
		try {
			const response = await fetch(
				`${API_BASE_URL}/api/userinfo/id-check?id=${formData.id}`
			);
			if (response.ok) {
				const result = await response.text();
				if (result === "가입가능") {
					alert("사용 가능한 아이디입니다.");
					setFormData((prevData) => ({ ...prevData, idDuplicateCheck: true }));
				} else {
					alert("이미 사용 중인 아이디입니다.");
				}
			} else {
				console.error("ID 중복 확인 실패");
			}
		} catch (error) {
			console.error("서버 통신 오류", error);
		}
	};

	return (
		<div className={common.background}>
			<div className={common.main_area} onSubmit={handleJoin}>
				<div className={common.title_area}>회원가입</div>

				<div>
					<div className={styles.idEmailPwdInput_area}>
						<div className={styles.inputWithBtn}>
							<input
								type="text"
								name="id"
								placeholder="아이디"
								value={formData.id}
								onChange={handleInputChange}
                ref={idRef}
							/>
							<button
								className={common.themeBgrColor}
								onClick={handleDuplicateCheck}
							>
								중복확인
							</button>
						</div>

						<input
							type="password"
							name="password"
							placeholder="비밀번호"
							value={formData.password}
							onChange={handleInputChange}
						/>

						<div className={styles.inputWithBtn}>
							<input
								type="text"
								name="email"
								placeholder="이메일 주소"
								value={formData.email}
								onChange={handleInputChange}
							/>
							<button className={common.themeBgrColor} onClick={sendEmail}>
								인증하기
							</button>
						</div>
					</div>

					{isVerified ? ( // 인증이 확인되었을 때만 나타나게 함
						<div className={styles.userInfoInput_area}>
							<input
								type="text"
								name="name"
								placeholder="이름"
								value={formData.name}
								onChange={handleInputChange}
							/>

							<input
								type="text"
								name="phone"
								placeholder="번호"
								value={formData.phone}
								onChange={handleInputChange}
							/>

							<input
								type="text"
								name="address"
								placeholder="주소"
								value={formData.address}
								onChange={handleInputChange}
							/>

							<input
								className={common.themeBorder}
								type="text"
								name="house_num"
								placeholder="가구원 수"
								value={formData.house_num}
								onChange={handleInputChange}
							/>

							{/* <input className={styles.size} type="text" name="house_square" placeholder="평수" value={formData.house_square} onChange={handleInputChange} /> */}
							{/* <input className={styles.admin} type="text" name="admin" placeholder="관리자" /> */}
							<div className={common.btn_area}>
								<button className={common.themeBgrColor} onClick={handleJoin}>
									가입
								</button>
							</div>
						</div>
					) : (
						<div className={styles.inputEmileAuth_area}>
							<input
								className={common.themeBorder}
								type="text"
								name="emailauth"
								placeholder="이메일 인증 확인"
								value={formData.emailauth}
								onChange={handleInputChange}
							/>
							<div className={common.btn_area}>
								<button className={common.themeBgrColor} onClick={handleVerify}>
									인증확인
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
			<BottomNav />
		</div>
	);
}

export default Join;
