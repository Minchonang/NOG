import { NavLink } from "react-router-dom";
import common from "../common/css/common.module.css";

function SampleComp() {
	const go_login = () => {
		window.location.href = "/login";
	};
	const go_userInfo = () => {
		window.location.href = "/edit_userinfo";
	};
	const go_checkUser = () => {
		window.location.href = "/check_user";
	};
	return (
		<>
			<div>
				<button onClick={go_login}>로그인</button>
				<button onClick={go_checkUser}>본인확인</button>
				<button onClick={go_userInfo}>회원정보</button>
			</div>
		</>
	);
}

function Index() {
   return (
      <div>자다가도생각이나조</div>
   )
}

export default Index;