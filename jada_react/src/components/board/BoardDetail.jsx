import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BottomNav from "../common/jsx/BottomNav";
import Header from "../common/jsx/Header";
import common from "../common/css/common.module.css";
import style from "./css/BoardDetail.module.css";

function BoardDetail() {
  return (
    <div className={common.background}>
      <Header sub_title="" />

      <div className={common.main_area}>
        <BottomNav />
      </div>
    </div>
  );
}

export default BoardDetail;
