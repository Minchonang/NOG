import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { API_BASE_URL } from "../../App.js";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import common from "../common/css/common.module.css";
import style from "./css/Home.module.css";
import ChatBot from "../common/jsx/ChatBot";
import Loading from "../common/jsx/Loading";
import swal from "sweetalert";

import img1 from "../common/img/home/home_1.jpg";
import img2 from "../common/img/home/home_2.jpg";
import img3 from "../common/img/home/home_3.png";
import img4 from "../common/img/home/home_4.png";
import img5 from "../common/img/home/home_5.png";
import img6 from "../common/img/home/home_6.png";

function Home() {
	// 로딩
	const [isLoading, setIsLoading] = useState(true);
	// 슬라이드
	const slideRef = useRef(null);

	// 로딩 상태를 기반으로 로딩 화면을 표시하는 useEffect
	useEffect(() => {
		// 로딩 시작
		setIsLoading(true);

		// 2초 후에 로딩 완료
		const timeoutId = setTimeout(() => {
			setIsLoading(false);
		}, 2000);

		return () => {
			clearTimeout(timeoutId);
		};
	}, []);

	// 이미지 슬라이드를 설정하는 useEffect
	useEffect(() => {
		if (!isLoading && slideRef.current) {
			// 로딩이 끝난 후에만 실행되도록 조건 추가
			const slides = Array.from(slideRef.current.children); // Convert to array
			let currentSlide = 0;

			const showSlide = (index) => {
				slides.forEach((slide, i) => {
					slide.style.transform = `translateX(${100 * (i - index)}%)`;
					slide.style.display = i === index ? "block" : "none"; // Ensure initial display
				});
			};
			const nextSlide = () => {
				currentSlide = (currentSlide + 1) % slides.length;
				showSlide(currentSlide);
			};

			// 이미지 슬라이드 시작
			const slideInterval = setInterval(nextSlide, 3000);

			return () => {
				clearInterval(slideInterval); // 컴포넌트가 언마운트되면 인터벌 제거
			};
		}
	}, [isLoading]);

	const idRef = useRef();
	useEffect(() => {
		setTimeout(() => {
			if (idRef.current) {
				idRef.current.focus();
			}
		}, 500);
	}, []);

	const [userId, setUserId] = useState("");
	const [userPwd, setUserPwd] = useState("");

	// 비밀번호에서 enter 입력 시 로그인 시도
	const keyDownEnter = (e) => {
		if (e.key === "Enter") {
			handleLogin(e);
		}
	};

	const handleLogin = async (e) => {
		e.preventDefault();

		const requestData = {
			id: userId,
			password: userPwd,
		};

		try {
			const response = await fetch(`${API_BASE_URL}/api/userinfo/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "ip: 8080",
				},
				body: JSON.stringify(requestData),
			});

			if (response.ok) {
				// 로그인 성공 처리
				console.log("로그인 성공");

				// 서버에서 반환된 값 출력
				const responseData = await response.json();
				// console.log('서버 응답 데이터:', responseData);
				// userId 추출
				const receivedUserId = responseData.id;
				const receivedUserRole = responseData.role;
				// console.log('유저 ID :', receivedUserId);
				// console.log('유저 ROLE :', receivedUserRole);
				window.sessionStorage.setItem("user_id", receivedUserId);

				if (receivedUserRole === 1) {
					window.location.href = "/admin";
				} else {
					window.location.href = "/analysis";
				}
			} else {
				// 로그인 실패 처리
				console.log("로그인 실패:", response.status);
				const errorMessage = await response.text();
				sessionStorage.removeItem("user_id");
				swal(
					"로그인 실패",
					"아이디 또는 비밀번호가 일치하지 않습니다.",
					"error"
				);
			}
		} catch (error) {
			console.error("로그인 중 오류 발생:", error);
			sessionStorage.removeItem("user_id");
			swal(
				"오류",
				"서버에 오류가 발생하였습니다. 다시 시도해 주세요.",
				"error"
			);
		}
	};

	//   비밀번호 아이콘
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword((prevShowPassword) => !prevShowPassword);
	};

	return (
		<>
			{isLoading ? (
				<Loading />
			) : (
				<div className={style.background}>
					<div className={style.title_area}>NOG</div>

					{/* 이미지 슬라이드 */}
					<div className={style.subtitle_area} ref={slideRef}>
						<div className={style.slide}>
							<img src={img1} alt="Image1" />
						</div>
						<div className={style.slide}>
							<img src={img2} alt="Image2" />
						</div>
						<div className={style.slide}>
							<img src={img3} alt="Image3" />
						</div>
						<div className={style.slide}>
							<img src={img4} alt="Image4" />
						</div>
						<div className={style.slide}>
							<img src={img5} alt="Image5" />
						</div>
						<div className={style.slide}>
							<img src={img6} alt="Image6" />
						</div>
					</div>

					<div className={style.main_area}>
						<div className={style.login_area}>로그인</div>
						<div className={common.input_area}>
							<input
								className={`${common.themeBorder} ${style.adminInput}`}
								type="text"
								value={userId}
								onChange={(e) => setUserId(e.target.value)}
								ref={idRef}
								placeholder="아이디 입력"
								maxLength="20"
							/>
							<div className={style.pwd_area}>
								<input
									className={style.adminInput}
									// className={common.themeBorder}
									type={showPassword ? "text" : "password"}
									value={userPwd}
									onChange={(e) => setUserPwd(e.target.value)}
									onKeyDown={keyDownEnter}
									placeholder="비밀번호 입력"
									maxLength="25"
								/>
								<span
									onClick={togglePasswordVisibility}
									className={style.eyeIcon}
								>
									{showPassword ? (
										<FaEye className={style.adminEyeIcon} />
									) : (
										<FaEyeSlash className={style.adminEyeIcon} />
									)}
								</span>
							</div>
						</div>
						<div className={common.btn_area}>
							<button
								className={`${common.themeBgrColor} ${style.adminButton}`}
								onClick={handleLogin}
							>
								로그인
							</button>
						</div>
						<div className={style.option_area}>
							<NavLink to="/find_id" activeclassname={common.themeColor}>
								아이디 찾기
							</NavLink>
							<span>|</span>
							<NavLink to="/find_pw" activeclassname={common.themeColor}>
								비밀번호 찾기
							</NavLink>
							<span>|</span>
							<NavLink to="/join" activeclassname={common.themeColor}>
								회원가입
							</NavLink>
						</div>
					</div>
					<ChatBot login={true} />
				</div>
			)}
		</>
	);
}

export default Home;
