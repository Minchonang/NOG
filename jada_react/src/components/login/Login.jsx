import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { API_BASE_URL } from "../../App.js";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import style from "./css/Login.module.css";
import common from "../common/css/common.module.css";

function Login() {
  // 페이지 진입 시 바로 아이디 입력(input)에 focus 실행
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
    // const formData = new URLSearchParams();
    // formData.append("id", userId);
    // formData.append("password", userPwd);

    try {
      const response = await fetch(`${API_BASE_URL}/api/userinfo/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "ip: 8080",
          // "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        // 로그인 성공 처리
        // const data = await response.json();
        console.log("로그인 성공:");
        console.log(response);

        // 서버에서 반환된 값 출력
        const responseData = await response.json();
        // userId 추출
        const receivedUserId = responseData.userId;
        console.log("서버 응답 데이터:", responseData);
        console.log(responseData.userId);
        window.sessionStorage.setItem("user_id", receivedUserId);

        window.location.href = "/analysis";
      } else {
        // 로그인 실패 처리
        console.log("로그인 실패:", response.status);
        const errorMessage = await response.text();
        sessionStorage.removeItem("user_id");
        alert(errorMessage);
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      sessionStorage.removeItem("user_id");
    }
  };

  //   비밀번호 아이콘
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <div className={common.background}>
        <div className={common.main_area}>
          <div className={common.title_area}>
            <NavLink to="/">NOG</NavLink>
          </div>
          <div className={common.input_area}>
            <input
              className={common.themeBorder}
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              ref={idRef}
              placeholder="아이디 입력"
              maxLength="20"
            />
            <div className={style.pwd_area}>
              <input
                className={common.themeBorder}
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
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>
          <div className={common.btn_area}>
            <button className={common.themeBgrColor} onClick={handleLogin}>
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
        <BottomNav />
      </div>
    </>
  );
}

export default Login;
