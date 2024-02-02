import common from "../common/css/common.module.css";
import style from "./css/Home.module.css";
import { NavLink } from "react-router-dom";
import img1 from "./img/img1.jpg";
import img2 from "./img/img2.jpg";
import React, { useEffect, useRef } from "react";

function Home() {
  const slideRef = useRef(null);

  useEffect(() => {
    const slides = Array.from(slideRef.current.children); // Convert to array
    let currentSlide = 0;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${100 * (i - index)}%)`;
        slide.style.display = i === index ? "block" : "none"; // Ensure initial display
      });
    };
    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    };

    // 이미지 슬라이드 시작
    const slideInterval = setInterval(nextSlide, 3000);

    return () => {
      clearInterval(slideInterval); // 컴포넌트가 언마운트되면 인터벌 제거
    };
  }, []);

  return (
    <div className={style.background}>
      <div className={style.title_area}>
        <NavLink to="/">NOG</NavLink>
        <NavLink to="/login">로그인</NavLink>
      </div>
      <div className={style.subtitle_area} ref={slideRef}>
        <div className={style.slide}>
          <img src={img2} alt="Image 1" />
        </div>
        <div className={style.slide}>
          <img src={img1} alt="Image 2" />
        </div>
      </div>
      <div className={style.main_area}>
        <div className={style.main_contents}>
          <div className={style.main_content_1}>
            <div className={style.content_title}>이번 달 전기 요금 예측</div>
            <div className={style.content_text}>
              사용자의 지난 전력 사용 패턴을 분석
            </div>
          </div>
          <div className={style.main_content_sub}>
            <div className={style.main_content_2}>
              <div className={style.content_title}>냉/난방 원격 제어</div>
              <div className={style.content_text}>
                평균 온도에 맞춰 자동으로 냉/난방기 조정
              </div>
            </div>
            <div className={style.main_content_3}>
              <div className={style.content_title}>Nog 챗봇 시스템</div>
              <div className={style.content_text}>
                다양한 정보를 Nog에게 물어보세요.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={style.join_area}>
        <NavLink to="/join">회원가입하러 가기</NavLink>
      </div>
    </div>
  );
}

export default Home;
