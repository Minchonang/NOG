import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../App.js";
import { FcHome } from "react-icons/fc";
import { FcCloseUpMode } from "react-icons/fc";
import { BiSolidDownArrow } from "react-icons/bi";
import { BiSolidUpArrow } from "react-icons/bi";

import axios from "axios";
import common from "../common/css/common.module.css";
import style from "./css/HomeControl.module.css";
import BottomNav from "../common/jsx/BottomNav";
import ChatBot from "../common/jsx/ChatBot.jsx";

function HomeControl() {
  useEffect(() => {
    serverlink();
  }, []);

  const [userId, setUserId] = useState("0");
  const [userAddress1, setUserAddress1] = useState("");
  const [userAddress2, setUserAddress2] = useState("");
  const [outdoorTemp, setOutdoorTemp] = useState("0");
  const [weatherIcon, setWeatherIcon] = useState("0");
  const [recommendTemp, setRecommendTemp] = useState("0");
  const [userHumanCount, setUserHumanCount] = useState("0");

  const [homeTemp, setUserHomeTemp] = useState("0");

  const [homeLightOnOff, setHomeLightOnOff] = useState("false");
  const [homeAirOnOff, setHomeAirOnOff] = useState("false");
  const [homeBoilerOnOff, setHomeBoilerOnOff] = useState("false");

  const [homeAirTemp, setHomeAirTemp] = useState(0);
  const [serverAirTemp, setServerAirTemp] = useState("");
  const [homeBoilerTemp, setHomeBoilerTemp] = useState(0);
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
        setUserHumanCount(result.humanCount);
        setHomeLightOnOff(result.light);
        setHomeBoilerOnOff(result.heater);
        setHomeAirOnOff(result.airconditioner);
        setUserHomeTemp(result.temperatureNow);
        setServerBoilerTemp(result.setBoilerTemp);
        setServerAirTemp(result.setAirTemp);
        setHomeBoilerTemp(result.setBoilerTemp);
        setHomeAirTemp(result.setAirTemp);
      } else {
        const errorData = await response.json(); // 추가: 오류 응답 내용 출력
        console.log("홈 디바이스 정보 조회 실패:", errorData);
        alert("오류가 발생하였습니다.");
      }
    } catch (error) {
      console.error("서버 통신 오류", error);
    }
  }

  // 서버에서 정보 가져오기
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

  // --------------- 서버전달용 -------------------
  const handleTemp = async () => {
    try {
      const userId = sessionStorage.getItem("user_id");

      // 클라이언트에서 서버로 전송할 데이터
      const requestData = {
        userId: userId,
        setBoilerTemp: serverBoilerTemp,
        setAirTemp: serverAirTemp,
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
        alert("데이터 전송 실패");
      }
    } catch (error) {
      console.error("데이터 전송 중 오류:", error);
      alert("데이터 전송 중 오류 발생");
    }
  };

  handleTemp();

  // --------------- 전등 -------------------
  //  전등 온오프
  const handleLightToggle = async () => {
    try {
      const userId = sessionStorage.getItem("user_id");

      // 클라이언트에서 서버로 전송할 데이터
      const requestData = {
        userId: userId,
        light: !homeLightOnOff, // 토글 값 전송
      };

      // 서버의 API 엔드포인트에 POST 요청 보내기
      const response = await axios.post(
        `${API_BASE_URL}/api/homedevice/editLight`,
        requestData
      );

      if (response.status === 200) {
        // 성공적으로 서버에 데이터 전송 후 상태 업데이트
        setHomeLightOnOff(!homeLightOnOff);
        console.log("데이터 전송 성공!");
      } else {
        console.log("데이터 전송 실패:", response.data);
        alert("데이터 전송 실패");
      }
    } catch (error) {
      console.error("데이터 전송 중 오류:", error);
      alert("데이터 전송 중 오류 발생");
    }
  };

  //  ---------------- 보일러 ------------------
  // 보일러 온도조절
  function handleBoilerTemp(change) {
    setHomeBoilerTemp((prevTemp) => {
      const newTemp = prevTemp + change;
      setServerBoilerTemp(newTemp); // 이 부분에서 최신값을 적용
      return newTemp;
    });
  }

  //  보일러 온오프
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
        alert("데이터 전송 실패");
      }
    } catch (error) {
      console.error("데이터 전송 중 오류:", error);
      alert("데이터 전송 중 오류 발생");
    }
  };

  // ---------------- 에어컨 ------------------
  // 에어컨 온도조절
  function handleAirTemp(change) {
    setHomeAirTemp((prevTemp) => {
      const newTemp = prevTemp + change;
      setServerAirTemp(newTemp); // 이 부분에서 최신값을 적용
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
        alert("데이터 전송 실패");
      }
    } catch (error) {
      console.error("데이터 전송 중 오류:", error);
      alert("데이터 전송 중 오류 발생");
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
          <FcHome className={style.fcHome} />
        </div>

        <div className={style.recommend_temp_area}>
          <div className={style.recommend_temp_title}>추천온도</div>
          <div className={style.recommend_temp}>{recommendTemp}</div>
          <FcCloseUpMode className={style.fcClose} />
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
          {homeLightOnOff ? (
            // TRUE
            <button className={style.toggleButton} onClick={handleLightToggle}>
              불 끄기
            </button>
          ) : (
            // FALSE
            <button className={style.toggleButton} onClick={handleLightToggle}>
              불 켜기
            </button>
          )}
        </div>

        {/*--------------------보일러--------------------*/}
        <div className={style.boilerAir_area}>
          <div className={style.boiler}>
            <div className={style.boiler_name}>보일러</div>
            <div className={style.boiler_temp}>
              <BiSolidDownArrow onClick={() => handleBoilerTemp(-1)} />
              {homeBoilerTemp}
              <BiSolidUpArrow onClick={() => handleBoilerTemp(1)} />
            </div>
            {homeBoilerOnOff ? (
              // TRUE
              <button
                className={style.toggleButton}
                onClick={handleBoilerToggle}
              >
                보일러 끄기
              </button>
            ) : (
              // FALSE
              <button
                className={style.toggleButton}
                onClick={handleBoilerToggle}
              >
                보일러 켜기
              </button>
            )}
          </div>

          {/*--------------------에어컨--------------------*/}
          <div className={style.airConditioner}>
            <div className={style.airConditioner_name}>에어컨</div>
            <div className={style.airConditioner_temp}>
              <BiSolidDownArrow onClick={() => handleAirTemp(-1)} />
              {homeAirTemp}
              <BiSolidUpArrow onClick={() => handleAirTemp(1)} />
            </div>
            {homeAirOnOff ? (
              // TRUE
              <button
                className={style.toggleButton}
                onClick={handleAirConditionerToggle}
              >
                에어컨 끄기
              </button>
            ) : (
              // FALSE
              <button
                className={style.toggleButton}
                onClick={handleAirConditionerToggle}
              >
                에어켠 켜기
              </button>
            )}
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}

export default HomeControl;
