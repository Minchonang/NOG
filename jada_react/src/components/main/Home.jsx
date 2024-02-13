import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import common from "../common/css/common.module.css";
import style from "./css/Home.module.css";
import img1 from "./img/img1.jpg";
import img2 from "./img/img2.jpg";
import cap1 from "./img/cap1.png";
import cap2 from "./img/cap2.png";
import cap3 from "./img/cap3.png";
import BottomNav from "../common/jsx/BottomNav";
import ChatBot from "../common/jsx/ChatBot";
import Loading from "../common/jsx/Loading";
import Modal from "react-modal";

function Home() {
  // 로딩
  const [isLoading, setIsLoading] = useState(true);
  // 슬라이드
  const slideRef = useRef(null);

  // 로딩 상태를 기반으로 로딩 화면을 표시하는 useEffect
  useEffect(() => {
    // 로딩 시작
    setIsLoading(true);

    // 2초 후에 로딩 완료
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // 이미지 슬라이드를 설정하는 useEffect
  useEffect(() => {
    if (!isLoading && slideRef.current) {
      // 로딩이 끝난 후에만 실행되도록 조건 추가
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
    }
  }, [isLoading]);

  // ---------------- 모달 ------------------
  const [modal1IsOpen, setModal1IsOpen] = useState(false);
  const [modal2IsOpen, setModal2IsOpen] = useState(false);
  const [modal3IsOpen, setModal3IsOpen] = useState(false);

  const openModal1 = () => {
    setModal1IsOpen(true);
  };

  const closeModal1 = () => {
    setModal1IsOpen(false);
  };

  const openModal2 = () => {
    setModal2IsOpen(true);
  };

  const closeModal2 = () => {
    setModal2IsOpen(false);
  };

  const openModal3 = () => {
    setModal3IsOpen(true);
  };

  const closeModal3 = () => {
    setModal3IsOpen(false);
  };

  Modal.setAppElement("#root");
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className={style.background}>
          <div className={style.title_area}>
            <NavLink to="/">NOG</NavLink>
            <NavLink to="/login">로그인</NavLink>
          </div>
          <div className={style.subtitle_area} ref={slideRef}>
            <div className={style.slide}>
              <img src={img2} alt="Image1" />
            </div>
            <div className={style.slide}>
              <img src={img1} alt="Image2" />
            </div>
          </div>
          <div className={style.main_area}>
            <div className={style.main_contents}>
              {/* ------------------------------------------- */}
              {/* 컨텐츠 1  */}
              <div className={style.main_content_1}>
                <div className={style.content_title}>
                  이번 달 나의 전기 요금은?
                </div>
                <div className={style.content_text} onClick={openModal1}>
                  자세히 보기
                </div>
              </div>
              {/* ------------------------------------------- */}
              {/* 모달1 */}
              <Modal
                isOpen={modal1IsOpen}
                onRequestClose={closeModal1}
                className={style.custom_modal}
              >
                <div className={style.modal_container}>
                  <div className={style.modal_title}>
                    NOG만의 AI 분석 기술로 <br /> 우리집의 전력 사용 패턴을
                    알아보세요!
                  </div>

                  <div className={style.modal_sub_title}>
                    다음과 같은 분석 결과를 보여드립니다.
                  </div>
                  <div className={style.modal_content}>
                    <br />
                    ▶ 이번 달 전력 사용량 예측
                    <br />
                    ▶ 가장 높은 전력소비시간 <br />
                    ▶ 전력 소비량이 가장 높은 요일 <br />
                    ▶ 이번 달 가장 많은 전력을 소비한 날 <br />
                    ▶ 하루 평균 전력 사용량 <br />▶ 지역주민 대비 전력 사용량
                  </div>

                  <img
                    src={cap1}
                    alt="Cap1"
                    style={{
                      width: "100%",
                      height: "auto",
                      marginBottom: "1em",
                    }}
                  />
                  <button onClick={closeModal1} className={style.modal_btn}>
                    <NavLink to="/">이전으로 돌아가기</NavLink>
                  </button>
                </div>
              </Modal>

              <div className={style.main_content_sub}>
                {/* ------------------------------------------- */}
                {/* 컨텐츠 2  */}
                <div className={style.main_content_2}>
                  <div className={style.content_title}>
                    <div>냉/난방</div>
                    <div>온도 제어</div>
                  </div>
                  <div className={style.content_text} onClick={openModal2}>
                    자세히 보기
                  </div>
                </div>
                {/* ------------------------------------------- */}
                {/* 모달2 */}
                <Modal
                  isOpen={modal2IsOpen}
                  onRequestClose={closeModal2}
                  className={style.custom_modal}
                >
                  <div className={style.modal_container}>
                    <div className={style.modal_title}>
                      앗! 집에 아무도 없는데 <br /> 불을 켜고 나왔다?
                    </div>

                    <div className={style.modal_sub_title}>
                      NOG만의 인체 감지 시스템과 <br />
                      원격 제어 시스템으로 <br />집 안에 몇 명이 있는지 확인하고
                      <br /> 에어컨, 보일러, 조명을 조절하세요.
                    </div>
                    <div className={style.modal_content}></div>
                    <img
                      src={cap2}
                      alt="Cap2"
                      style={{
                        width: "100%",
                        height: "auto",
                        marginBottom: "1em",
                      }}
                    />

                    <button onClick={closeModal2} className={style.modal_btn}>
                      <NavLink to="/">이전으로 돌아가기</NavLink>
                    </button>
                  </div>
                </Modal>

                {/* ------------------------------------------- */}
                {/* 컨텐츠 3  */}
                <div className={style.main_content_3}>
                  <div className={style.content_title}>
                    <div>Nog</div>
                    <div>Chatbot</div>
                  </div>
                  <div className={style.content_text} onClick={openModal3}>
                    자세히 보기
                  </div>
                </div>
              </div>
              {/* ------------------------------------------- */}
              {/* 모달3 */}
              <Modal
                isOpen={modal3IsOpen}
                onRequestClose={closeModal3}
                className={style.custom_modal}
              >
                <div className={style.modal_container}>
                  <div className={style.modal_title}>
                    NOG에서 개발한 <br />
                    스마트 챗봇
                    <br /> 노지와 대화해보세요!
                  </div>

                  <div className={style.modal_sub_title}>
                    NOG 및 에너지 절약에 대한 설명과 <br />
                    각종 기능 사용을 도와드립니다.
                  </div>
                  <div className={style.modal_content}></div>
                  <img
                    src={cap3}
                    alt="Cap3"
                    style={{
                      width: "100%",
                      height: "auto",
                      marginBottom: "1em",
                    }}
                  />
                  <button onClick={closeModal3} className={style.modal_btn}>
                    <NavLink to="/">이전으로 돌아가기</NavLink>
                  </button>
                </div>
              </Modal>

              <div className={style.main_content_4}>
                <div className={style.content_title}>
                  <div>{`이번달 전기세가\n자다가도 생각이 난다면?`}</div>
                  <NavLink to="/join">
                    <button className={style.join_btn}>회원가입</button>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <ChatBot />
        </div>
      )}
    </>
  );
}

export default Home;
