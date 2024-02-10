import bottom from "../css/BottomNav.module.css";

import { TbUserQuestion } from "react-icons/tb";
import { TbMessageQuestion } from "react-icons/tb";
import { TbDeviceMobileQuestion } from "react-icons/tb";

function AdminNav({ onTabChange }) {
  return (
    <>
      <div className={bottom.background}>
        <div className={bottom.main_area}>
          <div
            className={bottom.nav_btn}
            onClick={() => onTabChange("회원정보")}
          >
            <TbUserQuestion className={bottom.navImg} />
            <div>회원정보</div>
          </div>
          <div
            className={bottom.nav_btn}
            onClick={() => onTabChange("문의사항")}
          >
            <TbMessageQuestion className={bottom.navImg} />
            <div>문의사항</div>
          </div>

          <div
            className={bottom.nav_btn}
            onClick={() => onTabChange("노지분석")}
          >
            <TbDeviceMobileQuestion className={bottom.navImg} />
            <div>노지분석</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminNav;
