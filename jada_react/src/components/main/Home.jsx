import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import common from '../common/css/common.module.css';
import style from './css/Home.module.css';
import img1 from './img/img1.jpg';
import img2 from './img/img2.jpg';
import BottomNav from '../common/jsx/BottomNav';
import ChatBot from '../common/jsx/ChatBot';
import Loading from '../common/jsx/Loading';

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
                    slide.style.display = i === index ? 'block' : 'none'; // Ensure initial display
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
