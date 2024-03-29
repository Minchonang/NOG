import { createRef } from "react";
import bottom from "../css/BottomNav.module.css";

import { TbUserQuestion } from "react-icons/tb";
import { TbMessageQuestion } from "react-icons/tb";
import { TbDeviceMobileQuestion } from "react-icons/tb";

function AdminNav({ onTabChange, currentTab }) {
	return (
		<>
			<div className={bottom.admin_background}>
				<div className={bottom.main_area}>
					<div
						className={bottom.nav_btn}
						onClick={() => onTabChange("회원정보")}
					>
						<TbUserQuestion
							color={currentTab === "회원정보" ? "#ff9f0a" : ""}
							className={bottom.navImg}
						/>
						<div>회원정보</div>
					</div>
					<div
						className={bottom.nav_btn}
						onClick={() => onTabChange("문의사항")}
					>
						<TbMessageQuestion
							color={currentTab === "문의사항" ? "#ff9f0a" : ""}
							className={bottom.navImg}
						/>
						<div>문의사항</div>
					</div>

					<div
						className={bottom.nav_btn}
						onClick={() => onTabChange("유저분석")}
					>
						<TbDeviceMobileQuestion
							color={currentTab === "유저분석" ? "#ff9f0a" : ""}
							className={bottom.navImg}
						/>

						<div>유저분석</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default AdminNav;
