import common from "../common/css/common.module.css";
import style from "./css/Home.module.css";
import { NavLink } from "react-router-dom";

function Home() {
  return (
    <div className={common.background}>
      <div className={style.title_area}>
        <NavLink to="/">NOG</NavLink>
      </div>
      <div className={style.main_area}>
        <div className={style.subtitle_area}>
          <div>Nog에 오신걸 환영합니다.</div>
        </div>
        <div> 저희 Nog에서는 </div>
        <div className="main_contents">
          <div className={style.main_content}>
            <div className={style.content_title}>이번 달 전기 요금 예측</div>
            <div className={style.content_text}>
              사용자의 지난 전력 사용 패턴을 분석
            </div>
          </div>
          <div className={style.main_content}>
            <div className={style.content_title}>냉/난방 원격 제어</div>
            <div className={style.content_text}>
              전력 사용 패턴을 분석을 통한
            </div>
          </div>
          <div className={style.main_content}>
            <div className={style.content_title}>Nog 챗봇 시스템</div>
            <div className={style.content_text}>
              다양한 정보를 Nog에게 물어보세요.
            </div>
          </div>
        </div>
      </div>
      {/* <div className={style.join_area}>
        <NavLink to="/join">회원가입하러 가기</NavLink>
      </div> */}
    </div>
  );
}

export default Home;
