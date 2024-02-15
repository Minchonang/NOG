import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import FindId from './components/findId/FindId';
import FindPw from './components/findPw/FindPw';
import Join from './components/Join/Join';
import Home from './components/main/Home';
import CheckUser from './components/editUserInfo/CheckUser';
import EditUserInfo from './components/editUserInfo/EditUserInfo';
import DeleteCheck from './components/editUserInfo/DeleteCheck';
import MyChart from './components/myHome/chart/MyChart';
import ChatTest from './components/chatTest/ChatTest';
import HomeControl from './components/homeControl/HomeControl';
import Admin from './components/admin/Admin';
import Board from './components/board/Board';
import BoardList from './components/board/BoardList';
import BoardDetail from './components/board/BoardDetail';

// const API_BASE_URL = 'http://localhost:8080';
const API_BASE_URL = 'http://localhost:8080';

function App() {
    const userId = sessionStorage.getItem('user_id');

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={userId ? <MyChart /> : <Navigate to="/" />} />
                    <Route path="/chatbot" element={<ChatTest />} />
                    <Route path="/find_id" element={<FindId />} />
                    <Route path="/find_pw" element={<FindPw />} />
                    <Route path="/join" element={<Join />} />
                    <Route path="/analysis" element={userId ? <MyChart /> : <Navigate to="/" />} />
                    <Route path="/check_user" element={userId ? <CheckUser /> : <Navigate to="/" />} />
                    <Route path="/edit_userinfo" element={userId ? <EditUserInfo /> : <Navigate to="/" />} />
                    <Route path="/delete_check" element={userId ? <DeleteCheck /> : <Navigate to="/" />} />
                    <Route path="/homeControl" element={userId ? <HomeControl /> : <Navigate to="/" />} />
                    <Route path="/admin" element={userId ? <Admin /> : <Navigate to="/" />} />
                    <Route path="/board" element={userId ? <Board /> : <Navigate to="/" />} />
                    <Route path="/boardList" element={userId ? <BoardList /> : <Navigate to="/" />} />
                    <Route path="/boardDetail/:boardId" element={userId ? <BoardDetail /> : <Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
export { API_BASE_URL };

/*
Github에서 repository 복제한 후,
cd jada_react (터미널에서 React 경로 이동 필요)

npm install
npm install react-router-dom
npm install react-modal
npm install react-icons
npm install socket.io-client
npm install axios
npm install styled-components
npm install react-chartjs-2

-- jada_react 경로에서 가상환경 켜기 --
pip install flask
pip install flask-cors
pip install flask-socketio
pip install torch
pip install sentence_transformers

python server.py -> 챗봇 실행
SpringBoot 실행
npm start 또는 npm run start (실행하기)

----- 버전 정보 -----
node.js 18.17.1
(nvm install 18.17.1)

----- 사용한 라이브러리 -----
react-router-dom: 6.21.3
react-chartjs: 5.2.0
react-icons: 5.0.1
react-modal: 3.16.1
*/
