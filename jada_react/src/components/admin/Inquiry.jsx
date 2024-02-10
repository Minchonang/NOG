import React from "react";
import Header from "../common/jsx/Header";
import common from "../common/css/common.module.css";
import style from "./css/UserList.module.css";

function Inquiry() {
  return (
    <div className={common.background}>
      <Header sub_title="관리자" />

      <div className={style.main_area}>
        <div className={style.title}>
          <div>문의사항</div>
        </div>
        <p>이 페이지는 문의사항을 보여주는 페이지입니다.</p>
      </div>
    </div>
  );
}

export default Inquiry;
