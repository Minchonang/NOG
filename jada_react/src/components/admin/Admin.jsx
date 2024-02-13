import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../App";
import Header from "../common/jsx/Header";
import common from "../common/css/common.module.css";
import AdminNav from "../common/jsx/AdminNav.jsx";

import UserList from "./UserList";
import Inquiry from "./Inquiry";
import NogiAnalysis from "./NogiAnalysis";

function Admin() {
  const [currentTab, setCurrentTab] = useState("문의사항");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    getUserRole();
  }, []);

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  const getUserRole = async () => {
    const userId = sessionStorage.getItem("user_id");
    try {
      const response = await fetch(`${API_BASE_URL}/api/userinfo/getRole`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: userId,
      });

      if (response.ok) {
        const result = await response.json();
        setUserRole(result.role);
      } else {
        console.log("서버 오류");
      }
    } catch (error) {
      console.error("서버 통신 오류", error);
    }
  };

  if (userRole !== "1") {
    alert("접근 권한이 없습니다.");
    window.location.href = "/analysis";
    return null;
  }

  return (
    <div className={common.background}>
      <Header sub_title="관리자" />
      <AdminNav currentTab={currentTab} onTabChange={handleTabChange} />

      {currentTab === "회원정보" && <UserList currentTab={currentTab} />}
      {currentTab === "문의사항" && <Inquiry currentTab={currentTab} />}
      {currentTab === "유저분석" && <NogiAnalysis currentTab={currentTab} />}
    </div>
  );
}

export default Admin;
