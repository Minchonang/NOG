import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../App.js";

import React from "react";
import BottomNav from "../common/jsx/BottomNav";
import Header from "../common/jsx/Header";
import common from "../common/css/common.module.css";
import style from "./css/Board.module.css";

function Board() {
  const [userId, setUserId] = useState("");

  const serverLink = async (e) => {
    // user_id를 가져오기
    const user_id = sessionStorage.getItem("user_id");

    // 주소 추가 필요
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
        // // 서버 응답이 성공인 경우
        const result = await response.json();
        // 추출된 데이터 사용
        setUserId(result.userId);
      } else {
        console.log("회원 정보 조회 실패");
        alert("오류가 발생하였습니다.");
      }
    } catch (error) {
      console.error("서버 통신 오류", error);
    }
  };

  serverLink();
  return (
    <div className={common.background}>
      <Header sub_title="" />

      <div className={common.main_area}>
        <div className={style.boardContainer}>
          <div className={style.boardTitle}>
            <div>문의사항</div>
          </div>
          <select className={style.boardSelect}>
            <option value="" disabled selected>
              카테고리를 선택해주세요
            </option>
            <option value="서비스 이용 문의">서비스 이용 문의</option>
            <option value="챗봇 문의">챗봇 문의</option>
            <option value="계정 문의">계정 문의</option>
            <option value="기타 문의">기타 문의</option>
          </select>
          <div className={style.boardUser}>작성자 : {userId}</div>
          <input type="text" placeholder="제목" className={style.inputTitle} />
          <textarea
            placeholder="내용을 입력해주세요."
            className={style.inputField}
          />
          <button className={style.submitButton}>제출하기</button>
        </div>
        <BottomNav />
      </div>
    </div>
  );
}

export default Board;
