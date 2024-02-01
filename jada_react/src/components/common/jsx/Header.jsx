import { NavLink } from "react-router-dom";
import common from "../css/common.module.css";
import header from "../css/Header.module.css";

function Header() {
	return (
		<>
			<div className={header.title_area}>
				<NavLink to="/">NOG</NavLink>
				<div>마이 홈</div>
			</div>
		</>
	);
}
export default Header;
