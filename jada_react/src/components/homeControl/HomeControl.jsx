import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../App.js";
import common from "../common/css/common.module.css";
import style from "./css/HomeControl.module.css";
import BottomNav from "../common/jsx/BottomNav";
import axios from "axios";
import { FcHome } from "react-icons/fc";
import { FcCloseUpMode } from "react-icons/fc";
import { BiSolidDownArrow } from "react-icons/bi";
import { BiSolidUpArrow } from "react-icons/bi";
import ChatBot from "../common/jsx/ChatBot.jsx";

function HomeControl() {
	const [lightOn, setLightOn] = useState(false);
	const [boilerOn, setBoilerOn] = useState(false);
	const [airConditionerOn, setAirConditionerOn] = useState(false);
	const [boilerChecked, setBoilerChecked] = useState(false);
	const [airConditionerChecked, setAirConditionerChecked] = useState(false);
	// const [mode, setMode] = useState("");
	const [userId, setUserId] = useState("");
	const [userAddress1, setUserAddress1] = useState("");
	const [userAddress2, setUserAddress2] = useState("");
	const [userHomeId, setUserHomeId] = useState("");
	const [outdoorTemp, setOutdoorTemp] = useState("");
	const [weatherIcon, setWeatherIcon] = useState("");
	const [recommendTemp, setRecommendTemp] = useState(null);
	const [userHumanCount, setUserHumanCount] = useState("");

	const [homeTemp, setUserHomeTemp] = useState("");
	const [homeboilerOnOff, setHomeBoilerOnOff] = useState("");
	const [homeAirOnOff, setHomeAirOnOff] = useState("");
	const [homeLightOnOff, setHomeLightOnOff] = useState("");
	const [homeAirTemp, setHomeAirTemp] = useState("");
	const [homeBoilerTemp, setHomeBoilerTemp] = useState("");

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

	async function getWeather(lat, lon) {
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
	}

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
				setHomeBoilerTemp(result.setBoilerTemp);
				setHomeAirTemp(result.setAirTemp);
				console.log(homeLightOnOff);
			} else {
				const errorData = await response.json(); // 추가: 오류 응답 내용 출력
				console.log("홈 디바이스 정보 조회 실패:", errorData);
				alert("오류가 발생하였습니다.");
			}
		} catch (error) {
			console.error("서버 통신 오류", error);
		}
	}

	const serverlink = async (e) => {
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

				// 추출된 데이터 사용
				setUserId(result.userId);
				setUserAddress1(result.address1);
				setUserAddress2(result.address2);
				console.log(userId);
				getHomeDeviceData();

				// 주소를 위도와 경도로 변환하고, 날씨 정보 가져오기
				const fullAddress = `${result.address1} ${result.address2}`;
				getAddressLatLng(fullAddress).then((coords) => {
					getWeather(coords.lat, coords.lng);
				});
			} else {
				console.log("회원 정보 조회 실패");
				alert("오류가 발생하였습니다.");
			}
		} catch (error) {
			console.error("서버 통신 오류", error);
		}
	};

	serverlink();

	const handleLightToggle = async () => {
		try {
			// Update the database with the new light status
			const userId = sessionStorage.getItem("user_id");
			const lightStatus = !homeLightOnOff;

			const response = await fetch(`${API_BASE_URL}/api/homedevice/light`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId, lightStatus }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.log("Light 상태 업데이트 오류:", errorData);
				alert("Light 상태 업데이트 오류");
			} else {
				// 서버 응답이 성공인 경우에만 homeLightOnOff 업데이트
				setHomeLightOnOff(lightStatus);
			}
		} catch (error) {
			console.error("서버 통신 오류", error);
		}
	};

	const handleBoilerToggle = async () => {
		try {
			// Update the database with the new boiler status
			const userId = sessionStorage.getItem("user_id");
			const boilerStatus = !homeboilerOnOff;

			const response = await fetch(`${API_BASE_URL}/api/homedevice/boiler`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId, boilerStatus }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.log("Boiler 상태 업데이트 오류:", errorData);
				alert("Boiler 상태 업데이트 오류");
			} else {
				// Update homeBoilerOnOff only if the server response is successful
				setHomeBoilerOnOff(boilerStatus);
			}
		} catch (error) {
			console.error("서버 통신 오류", error);
		}
	};

	const handleAirConditionerToggle = async () => {
		try {
			// Update the database with the new air conditioner status
			const userId = sessionStorage.getItem("user_id");
			const airConditionerStatus = !homeAirOnOff;

			const response = await fetch(
				`${API_BASE_URL}/api/homedevice/airconditioner`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ userId, airConditionerStatus }),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				console.log("Air Conditioner 상태 업데이트 오류:", errorData);
				alert("Air Conditioner 상태 업데이트 오류");
			} else {
				// Update homeAirOnOff only if the server response is successful
				setHomeAirOnOff(airConditionerStatus);
			}
		} catch (error) {
			console.error("서버 통신 오류", error);
		}
	};

	return (
		<div className={common.background}>
			<div className={style.title_area}>
				<NavLink to="/analysis">NOG</NavLink>
				<div>제어 센터</div>
			</div>

			{/*--------------------온도-------------------- */}
			<div className={style.temp_area}>
				<div className={style.outdoor_temp_area}>
					<div className={style.outdoor_temp_title}>실외온도</div>
					<div className={style.outdoor_temp}>{outdoorTemp}</div>
					<img
						className={style.outdoor_temp_icon}
						src={`http://openweathermap.org/img/w/${weatherIcon}.png`}
					></img>
				</div>
				<div className={style.home_temp_area}>
					<div className={style.home_temp_title}>실내온도</div>
					<div className={style.home_temp}>{homeTemp}</div>
					<FcHome
						style={{
							width: "2em",
							height: "2em",
							display: "flex",
							justifyItems: "center",
							marginTop: "4px",
						}}
					/>
				</div>
				<div className={style.recommend_temp_area}>
					<div className={style.recommend_temp_title}>추천온도</div>
					<div className={style.recommend_temp}>{recommendTemp}</div>
					<FcCloseUpMode
						style={{
							width: "2em",
							height: "2em",
							display: "flex",
							justifyItems: "center",
							marginTop: "4px",
						}}
					/>
				</div>
			</div>

			<div className={style.main_area}>
				{/*--------------------집 인원--------------------*/}
				<div className={style.homeCount}>
					<div className={style.homeCount_name}>{userId}님의 집</div>
					<div className={style.count}>현재 {userHumanCount}명</div>
				</div>

				{/*--------------------전등--------------------*/}
				<div className={style.light}>
					{/* Display button based on homeLightOnOff */}
					{homeLightOnOff ? (
						<button className={style.toggleButton} onClick={handleLightToggle}>
							불 끄기
						</button>
					) : (
						<button className={style.toggleButton} onClick={handleLightToggle}>
							불 켜기
						</button>
					)}
				</div>

				<div className={style.boilerAir_area}>
					{/*--------------------보일러--------------------*/}
					<div className={style.boiler}>
						<div className={style.boiler_name}>보일러</div>
						<div className={style.boiler_temp}>
							<BiSolidDownArrow />
							{homeBoilerTemp}
							<BiSolidUpArrow />
						</div>

						<button
							className={`${style.toggleButton} ${
								homeboilerOnOff ? style.active : ""
							}`}
							onClick={handleBoilerToggle}
						>
							{homeboilerOnOff ? "보일러 끄기" : "보일러 켜기"}
						</button>

						{/* 
            <div className={style.heartSwitch}>
              <HeartSwitch
                size="md"
                checked={boilerChecked}
                onChange={(event) => {
                  setBoilerChecked(event.target.checked);
                }}
              />
            </div> */}
					</div>

					{/*--------------------에어컨--------------------*/}
					<div className={style.airConditioner}>
						<div className={style.airConditioner_name}>에어컨</div>
						<div className={style.airConditioner_temp}>
							<BiSolidDownArrow />
							{homeAirTemp}
							<BiSolidUpArrow />
						</div>
						<button
							className={`${style.toggleButton} ${
								homeAirOnOff ? style.active : ""
							}`}
							onClick={handleAirConditionerToggle}
						>
							{homeAirOnOff ? "에어컨 끄기" : "에어컨 켜기"}
						</button>
						{/* <div className={style.heartSwitch}>
              <HeartSwitch
                size="md"
                checked={airConditionerChecked}
                activeTrackFillColor="#6fa8dc"
                activeTrackStrokeColor="#6fa8dc"
                onChange={(event) => {
                  setAirConditionerChecked(event.target.checked);
                }}
              />
            </div> */}
					</div>
				</div>

				<ChatBot />
				<BottomNav />
			</div>
		</div>
	);
}

export default HomeControl;
