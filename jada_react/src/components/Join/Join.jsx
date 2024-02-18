import { NavLink } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';

import styles from './css/Join.module.css';
import common from '../common/css/common.module.css';
import { API_BASE_URL } from '../../App.js';
import BottomNav from '../common/jsx/BottomNav.jsx';
import { FaEye } from 'react-icons/fa';
import { FaEyeSlash } from 'react-icons/fa';

function Join() {
    const [selectedElement1, setSelectedElement1] = useState('');
    const [selectedElement2, setSelectedElement2] = useState('');
    const [authkey, setAuthkey] = useState('');
    const [isVerified, setIsVerified] = useState(false); // 인증 확인 상태. 초기값은 false.

    const [formData, setFormData] = useState({
        email: '',
        id: '',
        password: '',
        passwordConfirm: '',
        name: '',
        phone: '',
        address1: '',
        address2: '',
        address3: '',
        house_num: '',
        emailauth: '',
        // house_square:''
    });

    // 지역 옵션
    const options = {
        강원도: [
            '강릉시',
            '고성군',
            '동해시',
            '삼척시',
            '속초시',
            '양구군',
            '양양군',
            '영월군',
            '원주시',
            '인제군',
            '정선군',
            '철원군',
            '춘천시',
            '태백시',
            '평창군',
            '홍천군',
            '화천군',
            '횡성군',
        ],
        경기도: [
            '가평군',
            '고양시',
            '과천시',
            '광명시',
            '광주시',
            '구리시',
            '군포시',
            '김포시',
            '남양주시',
            '동두천시',
            '부천시',
            '성남시',
            '수원시',
            '시흥시',
            '안산시',
            '안성시',
            '안양시',
            '양주시',
            '양평군',
            '여주시',
            '연천군',
            '오산시',
            '용인시',
            '의왕시',
            '의정부시',
            '이천시',
            '파주시',
            '평택시',
            '포천시',
            '하남시',
            '화성시',
        ],
        경상남도: [
            '거제시',
            '거창군',
            '고성군',
            '김해시',
            '남해군',
            '밀양시',
            '사천시',
            '산청군',
            '양산시',
            '의령군',
            '진주시',
            '창녕군',
            '창원시',
            '통영시',
            '하동군',
            '함안군',
            '함양군',
            '합천군',
        ],
        경상북도: [
            '경산시',
            '경주시',
            '고령군',
            '구미시',
            '군위군',
            '김천시',
            '문경시',
            '봉화군',
            '상주시',
            '성주군',
            '안동시',
            '영덕군',
            '영양군',
            '영주시',
            '영천시',
            '예천군',
            '울릉군',
            '울진군',
            '의성군',
            '청도군',
            '청송군',
            '칠곡군',
            '포항시',
        ],
        광주광역시: ['광산구', '남구', '동구', '북구', '서구'],
        대구광역시: ['남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'],
        대전광역시: ['대덕구', '동구', '서구', '유성구', '중구'],
        부산광역시: [
            '강서구',
            '금정구',
            '기장군',
            '남구',
            '동구',
            '동래구',
            '부산진구',
            '북구',
            '사상구',
            '사하구',
            '서구',
            '수영구',
            '연제구',
            '영도구',
            '중구',
            '해운대구',
        ],
        서울특별시: [
            '강남구',
            '강동구',
            '강북구',
            '강서구',
            '관악구',
            '광진구',
            '구로구',
            '금천구',
            '노원구',
            '도봉구',
            '동대문구',
            '동작구',
            '마포구',
            '서대문구',
            '서초구',
            '성동구',
            '성북구',
            '송파구',
            '양천구',
            '영등포구',
            '용산구',
            '은평구',
            '종로구',
            '중구',
            '중랑구',
        ],
        세종특별자치시: ['세종시'],
        울산광역시: ['남구', '동구', '북구', '울주군', '중구'],
        인천광역시: ['강화군', '계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '옹진군', '중구'],
        전라남도: [
            '강진군',
            '고흥군',
            '곡성군',
            '광양시',
            '구례군',
            '나주시',
            '담양군',
            '목포시',
            '무안군',
            '보성군',
            '순천시',
            '신안군',
            '여수시',
            '영광군',
            '영암군',
            '완도군',
            '장성군',
            '장흥군',
            '진도군',
            '함평군',
            '해남군',
            '화순군',
        ],
        전라북도: [
            '고창군',
            '군산시',
            '김제시',
            '남원시',
            '무주군',
            '부안군',
            '순창군',
            '완주군',
            '익산시',
            '임실군',
            '장수군',
            '전주시',
            '정읍시',
            '진안군',
        ],
        제주특별자치도: ['서귀포시', '제주시'],
        충청남도: [
            '계룡시',
            '공주시',
            '금산군',
            '논산시',
            '당진시',
            '보령시',
            '부여군',
            '서산시',
            '서천군',
            '아산시',
            '예산군',
            '천안시',
            '청양군',
            '태안군',
            '홍성군',
        ],
        충청북도: [
            '괴산군',
            '단양군',
            '보은군',
            '영동군',
            '옥천군',
            '음성군',
            '제천시',
            '증평군',
            '진천군',
            '청주시',
            '충주시',
        ],
    };

    const handleChangeElement1 = (e) => {
        setSelectedElement1(e.target.value);
        setSelectedElement2(''); // Element1이 변경되면 Element2를 초기화
    };
    const idRef = useRef();
    useEffect(() => {
        setTimeout(() => {
            if (idRef.current) {
                idRef.current.focus();
            }
        }, 500);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // 이메일 인증 했는지 확인
    const handleVerify = (e) => {
        e.preventDefault();
        if (!authkey) {
            alert('인증번호를 먼저 요청하세요.');
            return;
        }
        if (authkey === formData.emailauth) {
            setIsVerified(true);
            alert('인증이 확인되었습니다.');
        } else {
            setIsVerified(false);
            alert('인증번호가 일치하지 않습니다.');
        }
    };

    // 회원가입버튼
    const handleJoin = async (e) => {
        e.preventDefault();

        if (!isVerified) {
            alert('이메일 인증을 먼저 완료하세요.');
            return;
        }
        // 비밀번호 정규식
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            alert('비밀번호 형식이 맞지않습니다.');
            return;
        }

        //  이메일 정규식
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(formData.email)) {
            alert('이메일 형식이 맞지않습니다.');
            return;
        }

        try {
            // JoinUserDto와 유사한 구조를 가진 데이터로 변환
            const joinUserDto = {
                email: formData.email,
                id: formData.id,
                password: formData.password,
                name: formData.name,
                phone: formData.phone,
                address1: selectedElement1,
                address2: selectedElement2,
                address3: formData.address3,
                houseNum: formData.house_num,
                // houseSquare: formData.house_square, // 만약 사용할 경우
            };

            // 서버로 데이터 전송
            const response = await fetch(`${API_BASE_URL}/api/userinfo/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(joinUserDto),
            });

            if (response.ok) {
                console.log('회원가입 성공');
                alert('회원가입 성공');
                window.location.href = '/';
            } else {
                console.error('회원가입 실패');
                alert('회원가입 실패');
            }
        } catch (error) {
            console.error('서버 통신 오류', error);
        }
    };

    // 이메일인증
    const sendEmail = (e) => {
        e.preventDefault();
        console.log(formData.email);
        const data = {
            EMAIL: formData.email,
        };

        fetch(`${API_BASE_URL}/PwFind/Email`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            mode: 'cors',
        })
            .then((res) => res.json())
            .then((json) => {
                setAuthkey(json.AUTHKEY);
                console.log(json.AUTHKEY); // Use setNumber to update the state
            })
            .catch((error) => {
                console.error('Error fetching email:', error);
            });
    };

    // id 중복체크
    const handleDuplicateCheck = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/userinfo/id-check?id=${formData.id}`);
            if (response.ok) {
                const result = await response.text();
                if (result === '가입가능') {
                    alert('사용 가능한 아이디입니다.');
                    setFormData((prevData) => ({ ...prevData, idDuplicateCheck: true }));
                } else {
                    alert('이미 사용 중인 아이디입니다.');
                }
            } else {
                console.error('ID 중복 확인 실패');
            }
        } catch (error) {
            console.error('서버 통신 오류', error);
        }
    };

    //   비밀번호 아이콘
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div className={common.background}>
            <div className={styles.main_area} onSubmit={handleJoin}>
                <div className={common.title_area}>회원가입</div>
                <div>
                    <div className={styles.idEmailPwdInput_area}>
                        <div className={styles.inputWithBtn}>
                            <input
                                type="text"
                                name="id"
                                placeholder="아이디"
                                value={formData.id}
                                onChange={handleInputChange}
                                ref={idRef}
                            />
                            <button className={common.themeBgrColor} onClick={handleDuplicateCheck}>
                                중복확인
                            </button>
                        </div>
                        <div className={styles.pwd_area}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="비밀번호(영문, 숫자, 특수문자 조합으로 8자 이상)"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <span onClick={togglePasswordVisibility} className={styles.eyeIcon}>
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
                        <div className={styles.inputWithBtn}>
                            <input
                                type="text"
                                name="email"
                                placeholder="이메일 주소(ex.aaa@gmail.com)"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            <button className={common.themeBgrColor} onClick={sendEmail}>
                                인증하기
                            </button>
                        </div>
                    </div>

                    {isVerified ? ( // 인증이 확인되었을 때만 나타나게 함
                        <div className={styles.userInfoInput_area}>
                            <input
                                type="text"
                                name="name"
                                placeholder="이름"
                                value={formData.name}
                                onChange={handleInputChange}
                            />

                            <input
                                type="text"
                                name="phone"
                                placeholder="휴대폰 번호"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />

                            <input
                                className={common.themeBorder}
                                type="number"
                                name="house_num"
                                placeholder="가구원 수"
                                value={formData.house_num}
                                onChange={handleInputChange}
                            />
                            <div className={styles.addressInput_area}>
                                <div className={styles.address_fisrt_second_area}>
                                    <label className={styles.address_label}>주소</label>
                                    <select
                                        className={styles.addressInput}
                                        onChange={handleChangeElement1}
                                        value={selectedElement1}
                                    >
                                        <option value="" style={{ color: 'gray' }}>
                                            시/도
                                        </option>
                                        {Object.keys(options).map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        className={styles.addressInput}
                                        onChange={(e) => setSelectedElement2(e.target.value)}
                                        value={selectedElement2}
                                    >
                                        <option value="" style={{ color: 'gray' }}>
                                            시/군/구
                                        </option>
                                        {selectedElement1
                                            ? options[selectedElement1].map((option) => (
                                                  <option key={option} value={option}>
                                                      {option}
                                                  </option>
                                              ))
                                            : null}
                                    </select>
                                </div>

                                <div className={styles.address_third_area}>
                                    <input
                                        type="text"
                                        name="address3"
                                        placeholder="상세주소"
                                        value={formData.address3}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* <input className={styles.size} type="text" name="house_square" placeholder="평수" value={formData.house_square} onChange={handleInputChange} /> */}
                            {/* <input className={styles.admin} type="text" name="admin" placeholder="관리자" /> */}
                            <div className={common.btn_area}>
                                <button className={common.themeBgrColor} onClick={handleJoin}>
                                    가입
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.inputEmileAuth_area}>
                            <input
                                className={common.themeBorder}
                                type="text"
                                name="emailauth"
                                placeholder="이메일 인증 확인"
                                value={formData.emailauth}
                                onChange={handleInputChange}
                            />
                            <div className={common.btn_area}>
                                <button className={common.themeBgrColor} onClick={handleVerify}>
                                    인증확인
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.option_area}>
                    <NavLink to="/" activeclassname={common.themeColor}>
                        로그인으로 돌아가기
                    </NavLink>
                </div>
            </div>
            <div className={styles.pwd_area}>
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="비밀번호(영문, 숫자, 특수문자 조합으로 8자 이상)"
                    value={formData.password}
                    onChange={handleInputChange}
                />
                <span onClick={togglePasswordVisibility} className={styles.eyeIcon}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
            </div>
            <div className={styles.inputWithBtn}>
                <input
                    type="text"
                    name="email"
                    placeholder="이메일 주소(ex.aaa@gmail.com)"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <button className={common.themeBgrColor} onClick={sendEmail}>
                    인증하기
                </button>
            </div>
        </div>
    );
}

export default Join;
