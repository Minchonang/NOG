import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import "./App.css";

import Index from "./components/main/Index";
import Login from "./components/login/Login";

import Join from "./components/Join/Join";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Index />} />
					<Route path="/login" element={<Login />} />
					{/* <Route path="/find_id" element={<FindId />} /> */}
					{/* <Route path="/find_pw" element={<FindPw />} /> */}
					<Route path="/join" element={<Join />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

// Github에서 repository 복제한 후,
// cd jada_react (React 경로 이동 필요)
// npm install
// npm install react-router-dom
// 실행하기: npm start 또는 npm run start

// 사용한 라이브러리:
// react-router-dom: v. 6.21.3

export default App;

