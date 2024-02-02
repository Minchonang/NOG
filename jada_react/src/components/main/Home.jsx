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
        <NavLink to="/home">NOG</NavLink>
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
            <div className={style.content_title}>이번 달 나의 전기 요금은?</div>
            <div className={style.content_text}>자세히 보기</div>
          </div>
          <div className={style.main_content_sub}>
            <div className={style.main_content_2}>
              <div className={style.content_title}>
                <div>냉/난방</div>
                <div>온도 제어</div>
              </div>
              <div className={style.content_text}>자세히 보기</div>
            </div>
            <div className={style.main_content_3}>
              <div className={style.content_title}>
                <div>Nog</div>
                <div>Chatbot</div>
              </div>
              <div className={style.content_text}>자세히 보기</div>
            </div>
          </div>
          <div className={style.main_content_4}>
            <div className={style.content_title}>
              <div>이번달 전기세가</div>
              <div>자다가도 생각이난다면?</div>
              <button className="join_btn">회원가입하러 가기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
