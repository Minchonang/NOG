import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Index from "./components/main/Index";
import Login from "./components/login/Login";
import FindId from "./components/findId/FindId";
import FindPw from "./components/findPw/FindPw";
import Join from "./components/Join/Join";
import Home from "./components/main/Home";
import CheckUser from "./components/editUserInfo/CheckUser";
import EditUserInfo from "./components/editUserInfo/EditUserInfo";
import DeleteCheck from "./components/editUserInfo/DeleteCheck";

const API_BASE_URL = "http://localhost:8080";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/find_id" element={<FindId />} />
          <Route path="/find_pw" element={<FindPw />} />
          <Route path="/join" element={<Join />} />
          <Route path="/home" element={<Home />} />
          <Route path="/check_user" element={<CheckUser />} />
          <Route path="/edit_userinfo" element={<EditUserInfo />} />
          <Route path="/delete_check" element={<DeleteCheck />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

// Github에서 repository 복제한 후,
// cd jada_react (터미널에서 React 경로 이동 필요)
// npm install
// npm install react-router-dom
// npm start 또는 npm run start (실행하기)

// node.js 버전(nvm install 18.17.1):
// 18.17.1
// 사용한 라이브러리:
// react-router-dom: v. 6.21.3

export default App;
export { API_BASE_URL };
