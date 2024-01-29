import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Index from "./main/Index";
import Login from "./login/Login";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Index />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

// 사용한 라이브러리:
// react-router-dom: v. 6.21.3

export default App;
