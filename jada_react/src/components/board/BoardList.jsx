import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../App.js";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import BottomNav from "../common/jsx/BottomNav";
import Header from "../common/jsx/Header";
import common from "../common/css/common.module.css";
import style from "./css/BoardList.module.css";
import swal from "sweetalert";

function BoardList() {
  useEffect(() => {
    getBoardList();
  }, []);

  //   const [userId, setUserId] = useState("");
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [userId, setUserId] = useState("");

  //  ------- 게시글 list 가져오기 -------
  const getBoardList = async () => {
    try {
      const userId = sessionStorage.getItem("user_id");
      setUserId(userId);
      // 서버로 데이터 전송
      const response = await fetch(
        `${API_BASE_URL}/api/board/boardList/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // 서버 응답이 성공인 경우
        const result = await response.json();
        // console.log(result);
        // 추출된 데이터 사용
        setBoards(result);
      } else {
        console.log("문의사항 조회 실패");
        swal("오류", "오류가 발생하였습니다.", "error");
      }
    } catch (error) {
      console.error("서버 통신 오류", error);
    }
  };

  const goDetail = (boardId) => {
    window.location.href = `/boardDetail/${boardId}`;
  };

  return (
    <div className={common.background}>
      <Header sub_title="내 정보" userId={userId} />

      <div className={style.main_area}>
        <div className={style.title}>
          <div>문의사항</div>
        </div>
        <div className={style.list}>
          <div className={style.boardList_table}>
            <table>
              <tbody>
                <tr className={style.boardList_title}>
                  <td>No.</td>
                  <td>카테고리</td>
                  <td>제목</td>
                </tr>
                {boards.map((board) => (
                  <tr
                    key={board.boardId}
                    onClick={() => goDetail(board.boardId)}
                  >
                    <td>{board.boardId}</td>
                    <td>{board.boardCategory}</td>
                    <td style={{ color: board.comment ? "#ff9f0a" : "black" }}>
                      {board.title.length > 11
                        ? `${board.title.substring(0, 11)}...`
                        : board.title}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/board">
            <button className={style.writeButton}>문의하기</button>
          </Link>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export default BoardList;
