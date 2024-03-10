import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../App.js";
import { FcHome } from "react-icons/fc";
import { FcCloseUpMode } from "react-icons/fc";
import { BiSolidDownArrow } from "react-icons/bi";
import { BiSolidUpArrow } from "react-icons/bi";
import { BiPlus } from "react-icons/bi";
import { BiMinus } from "react-icons/bi";
import { FaLightbulb } from "react-icons/fa";
import { FaRegLightbulb } from "react-icons/fa";
import { FcHighPriority } from "react-icons/fc";

import axios from "axios";
import common from "../common/css/common.module.css";
import style from "./css/HomeControl.module.css";
import Header from "../common/jsx/Header";
import BottomNav from "../common/jsx/BottomNav";
import ChatBot from "../common/jsx/ChatBot";
import Modal from "react-modal";
import LoadingNog from "../common/jsx/LoadingNog";
import swal from "sweetalert";

import onBtn from "../common/img/homeControl/button_on.png";
import offBtn from "../common/img/homeControl/button_off.png";

function HomeControl() {
	// 로딩
	const [isLoading, setIsLoading] = useState(true);
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

	useEffect(() => {
		serverlink();
	}, []);

	const [userHomeId, setUserHomeId] = useState("");
	const [userId, setUserId] = useState("0");
	const [userAddress1, setUserAddress1] = useState("");
	const [userAddress2, setUserAddress2] = useState("");
	const [outdoorTemp, setOutdoorTemp] = useState("0");
	const [weatherIcon, setWeatherIcon] = useState("0");
	const [recommendTemp, setRecommendTemp] = useState("0");
	const [userHumanCount, setUserHumanCount] = useState("0");

	const [homeTemp, setUserHomeTemp] = useState("");

	const [homeBoilerOnOff, setHomeBoilerOnOff] = useState("");
	const [homeAirOnOff, setHomeAirOnOff] = useState("");
	const [homeLightOnOff, setHomeLightOnOff] = useState("");

	const [homeAirTemp, setHomeAirTemp] = useState("0");
	const [serverAirTemp, setServerAirTemp] = useState("");
	const [homeBoilerTemp, setHomeBoilerTemp] = useState("0");
	const [serverBoilerTemp, setServerBoilerTemp] = useState("");

	// 주소 위도 경도로 바꾸기
	const KAKAO_API_KEY = "64d6a3d901c3b9bdfedb6dd921427996"; // 카카오 API 키

	async function getAddressLatLng(address) {
		try {
			const response = await axios.get(
				`https://dapi.kakao.com/v2/local/search/address.json?query=${address}`,
				{
					headers: {
						Authorization: `KakaoAK ${KAKAO_API_KEY}`,
					},
				}
			);
			const { x, y } = response.data.documents[0].address;
			return { lat: y, lng: x };
		} catch (error) {
			console.error(error);
		}
	}

	// 위도 경도에 맞는 날씨 가져오기
	const API_KEY = "c1478feb49390d6a8beedaa2c52287f3"; // OpenWeatherMap API 키

	const getWeather = async (lat, lon) => {
		try {
			const response = await axios.get(
				`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
			);

			// 온도 정보 저장
			const outdoorTemp = response.data.main.temp;
			setOutdoorTemp(outdoorTemp);
			const weatherIcon = response.data.weather[0].icon;
			setWeatherIcon(weatherIcon);

			// 추천 온도 설정
			let recommendTemp;
			if (outdoorTemp < -10) {
				recommendTemp = "20~22";
			} else if (outdoorTemp < 10) {
				recommendTemp = "20~22";
			} else if (outdoorTemp < 20) {
				recommendTemp = "22~24";
			} else if (outdoorTemp < 30) {
				recommendTemp = "24~26";
			} else {
				recommendTemp = "26~28";
			}
			setRecommendTemp(recommendTemp);
		} catch (error) {
			console.error(error);
		}
	};

	// 집 정보 가져오기
	async function getHomeDeviceData() {
		// user_id를 가져오기
		const userId = sessionStorage.getItem("user_id");
		const homeDeviceDto = {
			userId: userId,
		};
		try {
			const response = await fetch(`${API_BASE_URL}/api/homedevice/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(homeDeviceDto),
			});

			if (response.ok) {
				// 서버 응답이 성공인 경우
				const result = await response.json();

				console.log("Home Device Data:", result);

				setUserHumanCount(result.humanCount);
				setHomeLightOnOff(result.light);
				setHomeBoilerOnOff(result.heater);
				setHomeAirOnOff(result.airconditioner);
				setUserHomeTemp(result.temperatureNow);
				setServerBoilerTemp(result.setBoilerTemp);
				setHomeBoilerTemp(result.setBoilerTemp);
				setServerAirTemp(result.setAirTemp);
				setHomeAirTemp(result.setAirTemp);
			} else {
				const errorData = await response.json();
				console.log("홈 디바이스 정보 조회 실패:", errorData);
			}
		} catch (error) {
			console.error("서버 통신 오류", error);
		}
	}

	// 서버와 연결
	const serverlink = async () => {
		// user_id를 가져오기
		const user_id = sessionStorage.getItem("user_id");

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
				// 서버 응답이 성공인 경우
				const result = await response.json();
				if (result.homeDevice == null) {
					openModal();
				}

				// 추출된 데이터 사용
				setUserId(result.userId);
				setUserAddress1(result.address1);
				setUserAddress2(result.address2);
				// console.log(userId);
				getHomeDeviceData();

				// 주소를 위도와 경도로 변환하고, 날씨 정보 가져오기
				const fullAddress = `${result.address1} ${result.address2}`;
				getAddressLatLng(fullAddress).then((coords) => {
					getWeather(coords.lat, coords.lng);
				});
			} else {
				console.log("회원 정보 조회 실패");
			}
		} catch (error) {
			console.error("서버 통신 오류", error);
		}
	};

	// --------------- 서버전달용 -------------------
	const handleTemp = async (newBoilerTemp, newAirTemp) => {
		try {
			const userId = sessionStorage.getItem("user_id");

			// 클라이언트에서 서버로 전송할 데이터
			const requestData = {
				userId: userId,
				setBoilerTemp: newBoilerTemp,
				setAirTemp: newAirTemp,
			};

			// 서버의 API 엔드포인트에 POST 요청 보내기
			const response = await axios.post(
				`${API_BASE_URL}/api/homedevice/editTemp`,
				requestData
			);

			if (response.status === 200) {
				console.log("데이터 전송 성공!");
			} else {
				console.log("데이터 전송 실패:", response.data);
				swal("오류", "데이터 전송 실패", "error");
			}
		} catch (error) {
			console.error("데이터 전송 중 오류:", error);
			swal("오류", "데이터 전송 중 오류 발생", "error");
		}
	};

	// --------------- 전등 -------------------
	const [message, setMessage] = useState("");

	useEffect(() => {
		console.log("userHumanCount updated:", userHumanCount);
		if (userHumanCount === 0 && homeLightOnOff) {
			updateLightStatus(false);
			setMessage("절전모드");
		}
	}, [userHumanCount, homeLightOnOff]);

	// ------------------
	useEffect(() => {
		console.log("userHumanCount updated:", userHumanCount);
		if (userHumanCount === 0 && homeLightOnOff) {
			updateLightStatus(false);
		}
	}, [userHumanCount, homeLightOnOff]);

	const updateLightStatus = async (status) => {
		try {
			const userId = sessionStorage.getItem("user_id");

			const requestData = {
				userId: userId,
				light: status,
			};

			const response = await axios.post(
				`${API_BASE_URL}/api/homedevice/editLight`,
				requestData
			);

			if (response.status === 200) {
				console.log("데이터 전송 성공!");
				setHomeLightOnOff(status);
			} else {
				console.log("데이터 전송 실패:", response.data);
				swal("오류", "데이터 전송 실패", "error");
			}
		} catch (error) {
			console.error("데이터 전송 중 오류:", error);
			swal("오류", "데이터 전송 중 오류 발생", "error");
		}
	};

	const handleLightToggle = async () => {
		updateLightStatus(!homeLightOnOff);
	};

	//  ---------------- 보일러 ------------------
	// 보일러 온도조절
	function handleBoilerTemp(change) {
		setHomeBoilerTemp((prevTemp) => {
			const newTemp = prevTemp + change;
			setServerBoilerTemp(newTemp);
			handleTemp(newTemp, homeAirTemp);
			return newTemp;
		});
	}

	// 보일러 On / Off
	const handleBoilerToggle = async () => {
		try {
			const userId = sessionStorage.getItem("user_id");

			// 클라이언트에서 서버로 전송할 데이터
			const requestData = {
				userId: userId,
				heater: !homeBoilerOnOff, // 토글 값 전송
			};

			// 서버의 API 엔드포인트에 POST 요청 보내기
			const response = await axios.post(
				`${API_BASE_URL}/api/homedevice/editBoiler`,
				requestData
			);
			if (response.status === 200) {
				// 성공적으로 서버에 데이터 전송 후 상태 업데이트
				setHomeBoilerOnOff(!homeBoilerOnOff);
				console.log("데이터 전송 성공!");
			} else {
				console.log("데이터 전송 실패:", response.data);
				swal("오류", "데이터 전송 실패", "error");
			}
		} catch (error) {
			console.error("데이터 전송 중 오류:", error);
			swal("오류", "데이터 전송 중 오류 발생", "error");
		}
	};

	// ---------------- 에어컨 ------------------
	// 에어컨 온도조절
	function handleAirTemp(change) {
		setHomeAirTemp((prevTemp) => {
			const newTemp = prevTemp + change;
			setServerAirTemp(newTemp);
			handleTemp(homeBoilerTemp, newTemp);
			return newTemp;
		});
	}

	//  에어컨 온오프
	const handleAirConditionerToggle = async () => {
		try {
			const userId = sessionStorage.getItem("user_id");

			// 클라이언트에서 서버로 전송할 데이터
			const requestData = {
				userId: userId,
				airconditioner: !homeAirOnOff, // 토글 값 전송
			};

			// 서버의 API 엔드포인트에 POST 요청 보내기
			const response = await axios.post(
				`${API_BASE_URL}/api/homedevice/editAir`,
				requestData
			);
			if (response.status === 200) {
				// 성공적으로 서버에 데이터 전송 후 상태 업데이트
				setHomeAirOnOff(!homeAirOnOff);
				console.log("데이터 전송 성공!");
			} else {
				console.log("데이터 전송 실패:", response.data);
				swal("오류", "데이터 전송 실패", "error");
			}
		} catch (error) {
			console.error("데이터 전송 중 오류:", error);
			swal("오류", "데이터 전송 중 오류 발생", "error");
		}
	};

	// ---------------- 모달 ------------------
	// 모달창
	const [modalIsOpen, setModalIsOpen] = useState(false);

	const openModal = () => {
		setModalIsOpen(true);
	};

	Modal.setAppElement("#root");

	return (
		<>
			{isLoading ? (
				<LoadingNog />
			) : (
				<div className={common.background}>
					<Header sub_title="우리집" userId={userId} />

					<Modal
						isOpen={modalIsOpen}
						onRequestClose={() => setModalIsOpen(false)}
						shouldCloseOnOverlayClick={false}
						className={style.custom_modal}
					>
						<div className={style.modal_container}>
							<FcHighPriority size="1.8em" />
							<div className={style.modal_title}>
								등록된 기기가 <br /> 없습니다.
							</div>

							<button className={style.modal_content}>
								<NavLink to="/check_user">등록하기</NavLink>
							</button>

							<button className={style.modal_content}>
								<NavLink to="/analysis">이전으로 돌아가기</NavLink>
							</button>
						</div>
					</Modal>

					{/*--------------------온도-------------------- */}
					<div className={style.temp_area}>
						<div className={style.outdoor_temp_area}>
							<div className={style.outdoor_temp_title}>실외 온도</div>
							<div className={style.outdoor_temp}>{`${outdoorTemp}˚C`}</div>
							<img
								className={style.outdoor_temp_icon}
								src={`http://openweathermap.org/img/w/${weatherIcon}.png`}
								alt="outTemp"
							/>
						</div>
						<div className={style.home_temp_area}>
							<div className={style.home_temp_title}>실내 온도</div>
							<div className={style.home_temp}>{`${homeTemp}˚C`}</div>
							<FcHome className={style.fcHome} />
						</div>
						<div className={style.recommend_temp_area}>
							<div className={style.recommend_temp_title}>추천 온도</div>
							<div className={style.recommend_temp}>{`${recommendTemp}˚C`}</div>
							<FcCloseUpMode className={style.fcClose} />
						</div>
					</div>

					<div className={style.main_area}>
						{/*--------------------집 인원 & 전등--------------------*/}
						<div className={style.countLight_area}>
							<div className={style.homeCount}>
								<div className={style.homeCount_name}>우리집</div>
								<div className={style.count}>{userHumanCount}명</div>
							</div>

							{homeLightOnOff ? (
								// TRUE
								<div className={style.lightBtn_on} onClick={handleLightToggle}>
									<div className={style.light_name}>조명</div>
									<div className={style.light}>
										<FaLightbulb color="ff9f0a" size="4em" />
									</div>
								</div>
							) : (
								// FALSE
								<div className={style.lightBtn_off} onClick={handleLightToggle}>
									<div className={style.light_name}>조명</div>
									<div className={style.light}>
										<FaLightbulb color="black" size="4em" />
									</div>
									{message && <p>{message}</p>}
								</div>
							)}
						</div>

						<div className={style.boilerAir_area}>
							{/*--------------------보일러--------------------*/}
							<div
								className={
									homeBoilerOnOff
										? `${style.boiler} ${style.boilerOn}`
										: style.boiler
								}
							>
								<div className={style.boiler_name}>보일러</div>
								{homeBoilerOnOff ? (
									<img
										src={onBtn}
										className={style.onOff_img}
										onClick={handleBoilerToggle}
										alt="onBtn"
									/>
								) : (
									<img
										src={offBtn}
										className={style.onOff_img}
										onClick={handleBoilerToggle}
										alt="offBtn"
									/>
								)}
								{homeBoilerOnOff ? (
									<div className={style.boiler_temp}>
										<div
											className={style.minusBtn_area}
											onClick={() => handleBoilerTemp(-1)}
										>
											<BiMinus />
										</div>
										<div
											className={style.boilerAirTemp}
										>{`${homeBoilerTemp}˚C`}</div>
										<div
											className={style.plusBtn_area}
											onClick={() => handleBoilerTemp(1)}
										>
											<BiPlus />
										</div>
									</div>
								) : (
									<div className={style.boiler_temp}>
										<div className={`${style.minusBtn_area} ${style.hidden}`}>
											<BiMinus />
										</div>
										<div className={style.boilerAirTemp}>꺼짐</div>
										<div className={`${style.plusBtn_area} ${style.hidden}`}>
											<BiPlus />
										</div>
									</div>
								)}
							</div>

							{/*--------------------에어컨--------------------*/}
							<div
								className={
									homeAirOnOff
										? `${style.airConditioner} ${style.airconOn}`
										: style.airConditioner
								}
							>
								<div className={style.airConditioner_name}>에어컨</div>

								{homeAirOnOff ? (
									<img
										src={onBtn}
										className={style.onOff_img}
										onClick={handleAirConditionerToggle}
										alt="onBtn"
									/>
								) : (
									<img
										src={offBtn}
										className={style.onOff_img}
										onClick={handleAirConditionerToggle}
										alt="offBtn"
									/>
								)}
								{homeAirOnOff ? (
									<div className={style.airConditioner_temp}>
										<div
											className={style.minusBtn_area}
											onClick={() => handleAirTemp(-1)}
										>
											<BiMinus />
										</div>
										<div
											className={style.boilerAirTemp}
										>{`${homeAirTemp}˚C`}</div>
										<div
											className={style.plusBtn_area}
											onClick={() => handleAirTemp(1)}
										>
											<BiPlus />
										</div>
									</div>
								) : (
									<div className={style.airConditioner_temp}>
										<div className={`${style.minusBtn_area} ${style.hidden}`}>
											<BiMinus />
										</div>
										<div className={style.boilerAirTemp}>꺼짐</div>
										<div className={`${style.plusBtn_area} ${style.hidden}`}>
											<BiPlus />
										</div>
									</div>
								)}
							</div>
						</div>

					</div>
						<ChatBot />
						<BottomNav activeHome={true} />
				</div>
			)}
		</>
	);
}

export default HomeControl;
