import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { API_BASE_URL } from "../../App.js";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

import common from "../common/css/common.module.css";
import BottomNav from "../common/jsx/BottomNav.jsx";
import style from "./css/CheckUser.module.css";

function CheckUser() {
  const activeUser = true;

  // 비밀번호 input에서 엔터 누르면 확인
  const pressEnter = (e) => {
    if (e.key === "Enter") {
      checkUserPwd(e);
    }
  };

  // 페이지가 열리면 input으로 바로 focus 상태가 되게 함
  const pwdRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      if (pwdRef.current) {
        pwdRef.current.focus();
      }
    }, 500);
  }, []);

  const [userPwd, setUserPwd] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // 비밀번호 확인
  const checkUserPwd = async (e) => {
    e.preventDefault();

    const requestData = {
      id: sessionStorage.getItem("user_id"),
      password: userPwd,
    };
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/userinfo/check-password`,
        {
          method: "POST",
          credentials: "include", // 쿠키를 요청 헤더에 포함하기 위한 설정
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "ip: 8080",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        // const data = await response.json();
        // console.log(requestData.id);
        console.log("비밀번호 일치");
        // alert("본인 확인이 완료되었습니다.");
        window.location.href = "/edit_userinfo";
      } else {
        // console.log(requestData.id);
        // console.log('로그인 실패:', response.status);
        console.log("로그인 실패");
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      // console.log(requestData.id);
      console.error("로그인 중 오류 발생:", error);
      alert(`통신 오류: ${error}`);
    }
  };

  return (
    <>
      <div className={common.background}>
        <div className={common.main_area}>
          <div className={common.title_area}>
            <NavLink to="/">NOG</NavLink>
          </div>
          <label className={common.guide_label}>
            회원님의 비밀번호를 다시 한번 확인합니다.
          </label>
          <div className={style.password_area}>
            <input
              type={showPassword ? "text" : "password"}
              value={userPwd}
              onChange={(e) => setUserPwd(e.target.value)}
              onKeyDown={pressEnter}
              ref={pwdRef}
              placeholder="비밀번호 입력"
              maxLength="25"
            />
            <span onClick={togglePasswordVisibility} className={style.eyeIcon}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <div className={common.btn_area}>
            <button className={common.themeBgrColor} onClick={checkUserPwd}>
              확인
            </button>
          </div>
        </div>
        <BottomNav activeUser={true} />
      </div>
    </>
  );
}

export default CheckUser;
