import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { FcExport } from "react-icons/fc";
import { FcAssistant } from "react-icons/fc";
import { FcRating } from "react-icons/fc";
import { FcMenu } from "react-icons/fc";
import { FcUnlock } from "react-icons/fc";

import { API_BASE_URL } from "../../../App.js";

import header from "../css/Header.module.css";

function Header({ sub_title, userId }) {
	const go_logout = async (e) => {
		e.preventDefault();
		// 세션 스크립트: 로그아웃 시 세션 지우기
		const user_id = sessionStorage.getItem("user_id");

		try {
			const response = await fetch(`${API_BASE_URL}/api/userinfo/logout`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ user_id }),
			});

			if (response.ok) {
				sessionStorage.removeItem("user_id");
				console.log("로그아웃 성공");
				window.location.href = "/";
			} else {
				console.log("로그아웃 실패");
			}
		} catch (error) {
			console.error("서버 통신 오류", error);
		}
	};

	const go_login = () => {
		window.location.href = "/";
	};

	const go_board = () => {
		userId
			? (window.location.href = "/boardList")
			: alert("로그인 후 이용 가능합니다.");
	};

	const go_coin = () => {
		userId
			? (window.location.href = "/coinpred")
			: alert("로그인 후 이용 가능합니다.");
	};

	// 햄버거 버튼 클릭 시 메뉴 등장
	const [isSubMenuVisible, setSubMenuVisible] = useState(false);
	const toggleSubMenu = () => {
		setSubMenuVisible(!isSubMenuVisible);
	};

	// 햄버거 버튼의 메뉴 영역 밖을 클릭하면 자동으로 닫힘
	const subMenuArea = useRef();
	useEffect(() => {
		const clickOutside = (e) => {
			if (
				isSubMenuVisible &&
				subMenuArea.current &&
				!subMenuArea.current.contains(e.target)
			) {
				setSubMenuVisible(false);
			}
		};
		document.addEventListener("mousedown", clickOutside);

		return () => {
			document.removeEventListener("mousedown", clickOutside);
		};
	}, [isSubMenuVisible]);

	return (
		<>
			<div className={header.title_area}>
				<NavLink to="/analysis">NOG</NavLink>
				<div className={header.sub_title}>{sub_title}</div>
				<FcMenu className={header.mainIcon} onClick={toggleSubMenu} />

				{isSubMenuVisible && (
					<div className={header.subMenu} ref={subMenuArea}>
						<div className={header.subMenuItem} onClick={go_coin}>
							<FcRating className={header.play} />
							<div>오늘의 코인</div>
						</div>
						<div className={header.subMenuItem} onClick={go_board}>
							<FcAssistant className={header.inquiry} />
							<div>문의하기</div>
						</div>
						{userId ? (
							<div className={header.subMenuItem} onClick={go_logout}>
								<FcExport className={header.logout} />
								<div>로그아웃</div>
							</div>
						) : (
							<div className={header.subMenuItem} onClick={go_login}>
								<FcUnlock className={header.logout} />
								<div>로그인</div>
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
}
export default Header;
