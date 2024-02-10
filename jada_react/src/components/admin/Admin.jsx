import React, { useState } from "react";
import Header from "../common/jsx/Header";
import common from "../common/css/common.module.css";
import AdminNav from "../common/jsx/AdminNav.jsx";

import UserList from "./UserList";
import Inquiry from "./Inquiry";
import NogiAnalysis from "./NogiAnalysis";

function Admin() {
  const [currentTab, setCurrentTab] = useState("회원정보");

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <div className={common.background}>
      <Header sub_title="관리자" />
      <AdminNav onTabChange={handleTabChange} />

      {currentTab === "회원정보" && <UserList />}
      {currentTab === "문의사항" && <Inquiry />}
      {currentTab === "노지분석" && <NogiAnalysis />}
    </div>
  );
}

export default Admin;
