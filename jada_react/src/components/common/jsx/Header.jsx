import { NavLink } from "react-router-dom";
import { GiExitDoor } from "react-icons/gi";
import { API_BASE_URL } from "../../../App.js";

import common from "../css/common.module.css";
import header from "../css/Header.module.css";

function Header({ sub_title }) {
  const go_logout = async (e) => {
    e.preventDefault();
    // 세션 스크립트: 로그아웃 시 세션 지우기
    const user_id = sessionStorage.getItem("user_id");

    try {
      const response = await fetch(`${API_BASE_URL}/api/userinfo/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id }),
      });

      if (response.ok) {
        sessionStorage.removeItem("user_id");
        console.log("로그아웃 성공");
        window.location.href = "/";
      } else {
        console.log("로그아웃 실패");
      }
    } catch (error) {
      console.error("서버 통신 오류", error);
    }
  };

  return (
    <>
      <div className={header.title_area}>
        <NavLink to="/analysis">NOG</NavLink>
        <div className={header.sub_title}>{sub_title}</div>
        <GiExitDoor className={header.logout} onClick={go_logout} />
      </div>
    </>
  );
}
export default Header;
