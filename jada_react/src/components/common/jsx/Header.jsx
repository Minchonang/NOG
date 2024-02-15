import { NavLink } from "react-router-dom";
import { FcExport } from "react-icons/fc";
import { API_BASE_URL } from "../../../App.js";
import { FcAssistant } from "react-icons/fc";
import { FcRating } from "react-icons/fc";
import { FcMenu } from "react-icons/fc";
import { useState } from "react";

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

  const go_board = () => {
    window.location.href = "/boardList";
  };

  const go_play = () => {
    window.location.href = "/boardList";
  };

  const [isSubMenuVisible, setSubMenuVisible] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuVisible(!isSubMenuVisible);
  };

  return (
    <>
      <div className={header.title_area}>
        <NavLink to="/analysis">NOG</NavLink>
        <div className={header.sub_title}>{sub_title}</div>
        <FcMenu className={header.mainIcon} onClick={toggleSubMenu} />

        {isSubMenuVisible && (
          <div className={header.subMenu}>
            <div className={header.subMenuItem} onClick={go_play}>
              <FcRating className={header.play} />
              즐길거리
            </div>
            <div className={header.subMenuItem} onClick={go_board}>
              <FcAssistant className={header.inquiry} />
              문의사항
            </div>
            <div className={header.subMenuItem} onClick={go_logout}>
              <FcExport className={header.logout} />
              로그아웃
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default Header;
