import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../App.js";

import React from "react";
import BottomNav from "../common/jsx/BottomNav";
import Header from "../common/jsx/Header";
import common from "../common/css/common.module.css";
import style from "./css/Board.module.css";

function Board() {
  useEffect(() => {
    const user_id = sessionStorage.getItem("user_id");
    setUserId(user_id);
  }, []);
  const [userId, setUserId] = useState("");
  const [boardCategory, setBoardCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const serverlink = async () => {
    const boardDto = {
      userId: userId,
      boardCategory: boardCategory,
      title: title,
      content: content,
    };
    if (boardCategory === "") {
      alert("카테고리를 선택해주세요.");
    } else {
      try {
        // 서버로 데이터 전송 - 경로 수정 필요
        const response = await fetch(`${API_BASE_URL}/api/board/write`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(boardDto),
        });

        const result = await response.json();

        if (response.ok) {
          alert(result.message);
          window.location.href = "/analysis";
        } else {
          console.log("문의사항 저장 실패");
          alert(result.error);
        }
      } catch (error) {
        console.error("서버 통신 오류", error);
      }
    }
  };

  return (
    <div className={common.background}>
      <Header sub_title="문의사항" />

      <div className={` ${style.main_area}`}>
        <div className={style.boardContainer}>
          <div className={style.boardTitle}>
            <div>문의사항</div>
          </div>
          <div className={style.input_area}>
            <select
              className={style.boardSelect}
              value={boardCategory}
              onChange={(e) => setBoardCategory(e.target.value)}
            >
              <option value="" disabled>
                카테고리를 선택해주세요.
              </option>
              <option value="서비스 이용 문의">서비스 이용 문의</option>
              <option value="챗봇 문의">챗봇 문의</option>
              <option value="계정 문의">계정 문의</option>
              <option value="기타 문의">기타 문의</option>
            </select>
            <input
              className={style.boardUser}
              value={`작성자: ${userId}`}
              disabled
            ></input>
            <input
              type="text"
              placeholder="제목"
              className={style.inputTitle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="내용을 입력해주세요."
              className={style.inputField}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <button className={style.submitButton} onClick={serverlink}>
            제출하기
          </button>
        </div>
        <BottomNav />
      </div>
    </div>
  );
}

export default Board;
