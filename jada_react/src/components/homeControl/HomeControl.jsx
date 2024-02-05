import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { API_BASE_URL } from '../../App.js';
import common from '../common/css/common.module.css';
import style from './css/HomeControl.module.css';
import Header from '../common/jsx/Header';
import BottomNav from '../common/jsx/BottomNav';
import chatbotimg from '../chatbot/nogimg.png';
import { HeartSwitch } from '@anatoliygatt/heart-switch';
import { DarkModeToggle } from '@anatoliygatt/dark-mode-toggle';
import axios from 'axios';

function HomeControl() {
    const [lightOn, setLightOn] = useState(false);
    const [boilerOn, setBoilerOn] = useState(false);
    const [airConditionerOn, setAirConditionerOn] = useState(false);
    const [boilerChecked, setBoilerChecked] = useState(false);
    const [airConditionerChecked, setAirConditionerChecked] = useState(false);
    const [mode, setMode] = useState('dark');
    const [userId, setUserId] = useState('');
    const [userAddress1, setUserAddress1] = useState('');
    const [userAddress2, setUserAddress2] = useState('');
    const [outdoorTemp, setOutdoorTemp] = useState('');
    const [weatherIcon, setWeatherIcon] = useState('');

    //   주소 위도 경도로 바꾸기
    const KAKAO_API_KEY = '64d6a3d901c3b9bdfedb6dd921427996'; // 카카오 API 키

    async function getAddressLatLng(address) {
        try {
            const response = await axios.get(`https://dapi.kakao.com/v2/local/search/address.json?query=${address}`, {
                headers: {
                    Authorization: `KakaoAK ${KAKAO_API_KEY}`,
                },
            });
            const { x, y } = response.data.documents[0].address;
            return { lat: y, lng: x };
        } catch (error) {
            console.error(error);
        }
    }

    //   위도 경도에 맞는 날씨 가져오기
    const API_KEY = '691b9681b64032def97f5cc8af02abb6'; // OpenWeatherMap API 키

    async function getWeather(lat, lon) {
        try {
            const response = await axios.get(
                `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
            );
            //   console.log(response.data.main.temp);
            setOutdoorTemp(response.data.main.temp);

            const weatherIcon = response.data.weather[0].icon;
            // console.log(weatherIcon); // 아이콘 정보 출력
            setWeatherIcon(weatherIcon);
        } catch (error) {
            console.error(error);
        }
    }

    //   위도 경도에 맞는 날씨 가져오기
    const WEATHER_API_KEY = 'AYsWy7LpTXGLFsuy6e1xbg'; //기상청 API 키

    const currentDate = new Date(); // 현재 시간
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = '00';
    const formattedDateTime = `${year}${month}${day}${hours}${minutes}`;

    // async function getWeather2(lat, lon) {
    //     try {
    //         const response = await axios.get(
    //             `/apis/typ01/url/kma_sfctm2.php?tm=202211300900&stn=0&help=1&authKey=${WEATHER_API_KEY}`,
    //             {
    //                 withCredentials: true,
    //             }
    //             // `/localapi/typ01/url/kma_sfctm2.php?tm=202211300900&stn=0&help=1&authKey=${WEATHER_API_KEY}`
    //             // `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${WEATHER_API_KEY}&numOfRows=10&pageNo=1&dataType=JSON&base_date=20211126&base_time=1400&nx=60&ny=127`
    //         );
    //         console.log(response.data);
    //         setOutdoorTemp(response.data);
    //         // console.log(outdoorTemp);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // user_id를 가져오기
    const user_id = sessionStorage.getItem('user_id');

    const editUserDto = {
        user_id: user_id,
    };

    const serverlink = async (e) => {
        try {
            // 서버로 데이터 전송 - 경로 수정 필요
            const response = await fetch(`${API_BASE_URL}/api/userinfo/userfind`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editUserDto),
            });
            if (response.ok) {
                // // 서버 응답이 성공인 경우
                const result = await response.json();

                // 추출된 데이터 사용
                setUserId(result.user_id);
                setUserAddress1(result.address1);
                setUserAddress2(result.address2);

                // 주소를 위도와 경도로 변환하고, 날씨 정보 가져오기
                const fullAddress = `${result.address1} ${result.address2}`;
                getAddressLatLng(fullAddress).then((coords) => {
                    //   console.log(result.address1);
                    //   console.log(result.address2);
                    //   console.log(fullAddress);
                    //   console.log(coords);
                    getWeather(coords.lat, coords.lng);
                });
            } else {
                console.log('회원 정보 조회 실패');
                alert('오류가 발생하였습니다.');
            }
        } catch (error) {
            console.error('서버 통신 오류', error);
        }
    };

    serverlink();

    //   const address = "광주광역시 광산구";
    //   getAddressLatLng(address).then((coords) => {
    //     console.log(coords); // 위도와 경도 출력
    //     getWeather(coords.lat, coords.lng);
    //   });

    return (
        <div className={common.background}>
            <div className={style.title_area}>
                <NavLink to="/home">NOG</NavLink>
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
                    <div className={style.home_temp}>3.2</div>
                </div>
                <div className={style.recommend_temp_area}>
                    <div className={style.recommend_temp_title}>추천온도</div>
                    <div className={style.recommend_temp}>3.2</div>
                </div>
            </div>

            <div className={style.main_area}>
                {/*--------------------집 인원--------------------*/}
                <div className={style.homeCount}>
                    <div className={style.homeCount_name}>현재 집에 남아있는 가족 수</div>
                    <div className={style.count}>0명</div>
                </div>

                {/*--------------------전등--------------------*/}
                <div className={style.light}>
                    {/* <div className={style.light_name}>전등</div> */}
                    {/* <label className={style.switch}>
            <input
              type="checkbox"
              checked={lightOn}
              onChange={() => setLightOn(!lightOn)}
            />
            <span className={`${style.slider} ${style.round}`}></span>
          </label> */}
                    <DarkModeToggle
                        mode={mode}
                        dark="Dark"
                        light="Light"
                        size="md"
                        inactiveTrackColor="#e2e8f0"
                        inactiveTrackColorOnHover="#f8fafc"
                        inactiveTrackColorOnActive="#cbd5e1"
                        activeTrackColor="#334155"
                        activeTrackColorOnHover="#1e293b"
                        activeTrackColorOnActive="#0f172a"
                        inactiveThumbColor="#1e293b"
                        activeThumbColor="#ffd966"
                        ariaLabel="Toggle color scheme"
                        onChange={(mode) => {
                            setMode(mode);
                        }}
                    />
                </div>

                <div className={style.boilerAir_area}>
                    {/*--------------------보일러--------------------*/}
                    <div className={style.boiler}>
                        <div className={style.boiler_name}>보일러</div>
                        <div className={style.boiler_temp}>보일러 온도</div>
                        {/* <label className={style.switch}>
              <input
                type="checkbox"
                checked={boilerOn}
                onChange={() => setBoilerOn(!boilerOn)}
              />
              <span className={`${style.slider} ${style.round}`}></span>
            </label> */}
                        <div className={style.heartSwitch}>
                            <HeartSwitch
                                size="md"
                                checked={boilerChecked}
                                onChange={(event) => {
                                    setBoilerChecked(event.target.checked);
                                }}
                            />
                        </div>
                    </div>

                    {/*--------------------에어컨--------------------*/}
                    <div className={style.airConditioner}>
                        <div className={style.airConditioner_name}>에어컨</div>
                        <div className={style.airConditioner_temp}>에어컨 온도</div>
                        {/* <label className={style.switch}>
              <input
                type="checkbox"
                checked={airConditionerOn}
                onChange={() => setAirConditionerOn(!airConditionerOn)}
              />
              <span className={`${style.slider} ${style.round}`}></span>
            </label> */}
                        <div className={style.heartSwitch}>
                            <HeartSwitch
                                size="md"
                                checked={airConditionerChecked}
                                activeTrackFillColor="#6fa8dc"
                                activeTrackStrokeColor="#6fa8dc"
                                onChange={(event) => {
                                    setAirConditionerChecked(event.target.checked);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <NavLink to="/chatbot">
                    <img className={`${style.chatbotimg} ${style.bounce}`} src={chatbotimg} alt="ChatBot" />
                </NavLink>
                <BottomNav />
            </div>
        </div>
    );
}

export default HomeControl;
