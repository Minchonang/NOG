import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BottomNav from "../common/jsx/BottomNav";
import Header from "../common/jsx/Header";
import common from "../common/css/common.module.css";
import style from "./css/BoardList.module.css";

function BoardList() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await axios.get("서버 API 주소");
      setBoards(response.data);
    } catch (error) {
      console.error("문의글을 불러오는데 실패했습니다", error);
    }
  };

  return (
    <div className={common.background}>
      <Header sub_title="" />

      <div className={common.main_area}>
        <div className={style.boardContainer}>
          <div className={style.boardTitle}>
            <div>문의사항</div>
          </div>

          {boards.map((board, index) => (
            <div className={style.boardItem} key={index}>
              <h2 className={style.boardItemTitle}>{board.title}</h2>
              <p className={style.boardItemContent}>{board.content}</p>
            </div>
          ))}

          <Link to="/board">
            <button className={style.writeButton}> 문의글 쓰기 </button>
          </Link>
        </div>
        <BottomNav />
      </div>
    </div>
  );
}

export default BoardList;
