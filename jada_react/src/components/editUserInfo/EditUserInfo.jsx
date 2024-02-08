import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { API_BASE_URL } from '../../App.js';
import common from '../common/css/common.module.css';
import style from './css/EditUserInfo.module.css';
import Header from '../common/jsx/Header';
import BottomNav from '../common/jsx/BottomNav.jsx';
import ChatBot from '../common/jsx/ChatBot.jsx';
import LoadingNog from '../common/jsx/LoadingNog';
import Modal from 'react-modal';

function EditUserInfo() {
    // 로딩
    const [isLoading, setIsLoading] = useState(true);
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

    // 휴대폰 번호를 010-0000 형식으로 변경
    function formatPhone(userPhone) {
        const part1 = userPhone.slice(0, 3);
        const part2 = userPhone.slice(3, 7);
        const part3 = userPhone.slice(7);

        return `${part1}-${part2}-${part3}`;
    }

    const [emailAuth, setEmailAuth] = useState('');
    const [authkey, setAuthkey] = useState('');
    const [isVerified, setIsVerified] = useState(false);

    const [selectedElement1, setSelectedElement1] = useState('');
    const [selectedElement2, setSelectedElement2] = useState('');
    const [selectedElement3, setSelectedElement3] = useState('');

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

    // 서버에서 받아온 유저 정보
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userAddress1, setUserAddress1] = useState('');
    const [userAddress2, setUserAddress2] = useState('');
    const [userAddress3, setUserAddress3] = useState('');
    const [userHouseNum, setUserHouseNum] = useState('');

    const serverlink = async (e) => {
        // user_id를 가져오기
        const user_id = sessionStorage.getItem('user_id');

        // 주소 추가 필요
        const editUserDto = {
            user_id: user_id,
        };

        try {
            // 서버로 데이터 전송 - 경로 수정 필요
            const response = await fetch(`${API_BASE_URL}/api/userinfo/userfind`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editUserDto),
            });
            if (response.ok) {
                // // 서버 응답이 성공인 경우
                const result = await response.json();
                // 추출된 데이터 사용
                setUserId(result.userId);
                setUserName(result.name);
                setUserEmail(result.email);
                setUserPhone(result.phone);
                setUserPassword(result.password);
                setUserAddress1(result.address1);
                setUserAddress2(result.address2);
                setUserAddress3(result.address3);
                setUserHouseNum(result.houseNum);
            } else {
                console.log('회원 정보 조회 실패');
                alert('오류가 발생하였습니다.');
            }
        } catch (error) {
            console.error('서버 통신 오류', error);
        }
    };

    serverlink();

    // 이메일 수정
    const [editEmail, setEditEmail] = useState(false);
    const [newEmail, setNewEmail] = useState(userEmail);
    const editEmailBtn = () => {
        setEditEmail(true);
    };
    const cancelEmailBtn = () => {
        setEditEmail(false);
    };

    // 번호 수정
    const [editPhone, setEditPhone] = useState(false);
    const [newPhone, setNewPhone] = useState(userPhone);
    const editPhoneBtn = () => {
        setEditPhone(true);
    };
    const cancelPhoneBtn = () => {
        setEditPhone(false);
    };

    // 비밀번호 수정
    const [editPwd, setEditPwd] = useState(false);
    const [newPwd, setNewPwd] = useState('');
    const editPwdBtn = () => {
        setEditPwd(true);
    };
    const cancelPwdBtn = () => {
        setEditPwd(false);
    };

    // 주소 수정
    const [editAddress, setEditAddress] = useState(false);
    const editAddressBtn = () => {
        setEditAddress(true);
    };
    const cancelAddressBtn = () => {
        setEditAddress(false);
    };

    // 이메일 인증
    const sendEmail = () => {
        console.log(newEmail);
        const data = {
            EMAIL: newEmail,
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
                console.log(json.AUTHKEY);
            })
            .catch((error) => {
                console.error('Error fetching email:', error);
            });
    };

    // 인증번호 확인
    const handleVerify = (e) => {
        e.preventDefault();
        console.log(emailAuth);

        if (!authkey) {
            alert('인증번호를 먼저 요청하세요.');
            return;
        }
        if (authkey === emailAuth) {
            setIsVerified(true);
            alert('인증되었습니다.');
            closeModal();
        } else {
            setIsVerified(false);
            alert('인증번호가 일치하지 않습니다.');
        }
    };

    // 모달창
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
        sendEmail();
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    Modal.setAppElement('#root');

    // 가구 수 수정
    const [editHouseNum, setEditHouseNum] = useState(false);
    const [newHouseNum, setNewHouseNum] = useState(userHouseNum);
    const editHouseNumBtn = () => {
        setEditHouseNum(true);
    };
    const cancelHouseNumBtn = () => {
        setEditHouseNum(false);
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        // user_id를 가져오기
        const userIdFromSession = sessionStorage.getItem('user_id');

        // const editUserDto = {
        // 	user_id: userIdFromSession,
        // 	email: newEmail,
        // 	phone: newPhone,
        // 	password: newPwd,
        // 	address1: selectedElement1,
        // 	address2: selectedElement2,
        // 	address3: selectedElement3,
        // 	houseNum: parseInt(newHouseNum),
        // };

        const editUserDto = {
            user_id: userIdFromSession,
        };

        // 새로운 이메일이 있는 경우에만 추가
        if (newEmail) {
            editUserDto.email = newEmail;
        } else {
            editUserDto.email = userEmail;
        }

        // 새로운 전화번호가 있는 경우에만 추가
        if (newPhone) {
            // newPhone이 올바른 전화번호 형식인지 검증
            const phoneRegex = /^\d{3}\d{3,4}\d{4}$/;
            if (!phoneRegex.test(newPhone)) {
                alert('휴대폰 번호 형식이 맞지 않습니다. \n예시: 01000000000');
                return;
            }
            // editUserDto.phone = newPhone ? newPhone : userPhone;
            editUserDto.phone = newPhone;
        } else {
            // alert('값이 입력되지 않아 원래값으로 설정됩니다.');
            editUserDto.phone = userPhone;
        }

        // 새로운 비밀번호가 있는 경우에만 추가
        if (newPwd) {
            // 비밀번호 정규식
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
            if (!passwordRegex.test(newPwd)) {
                alert('비밀번호 형식이 맞지않습니다.');
                return;
            }
            editUserDto.password = newPwd;
        } else {
            editUserDto.password = userPassword;
        }

        // 새로운 주소 정보가 있는 경우에만 추가
        if (selectedElement1) {
            editUserDto.address1 = selectedElement1;
        } else {
            editUserDto.address1 = userAddress1;
        }

        if (selectedElement2) {
            editUserDto.address2 = selectedElement2;
        } else {
            editUserDto.address2 = userAddress2;
        }
        if (selectedElement3) {
            editUserDto.address3 = selectedElement3;
        } else {
            editUserDto.address3 = userAddress3;
        }

        // 새로운 가구원 수가 있는 경우에만 추가
        if (newHouseNum) {
            // newHouseNum이 숫자인지 검증
            const numberRegex = /^[0-9]+$/;
            if (!numberRegex.test(parseInt(newHouseNum))) {
                alert('가구원 수는 숫자만 입력해야 합니다.');
                return;
            }
            // editUserDto.houseNum = newHouseNum ? parseInt(newHouseNum) : userHouseNum;
            editUserDto.houseNum = parseInt(newHouseNum);
        } else {
            // alert('값이 입력되지 않아 원래값으로 설정됩니다.');
            editUserDto.houseNum = userHouseNum;
        }

        try {
            // 서버로 데이터 전송
            const response = await fetch(`${API_BASE_URL}/api/userinfo/edituser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editUserDto),
            });
            if (response.ok) {
                console.log('회원 정보 수정 완료');
                alert('회원 정보가 수정되었습니다.');
                window.location.href = '/edit_userinfo';
            } else {
                console.log('회원 정보 수정 실패');
                alert('오류가 발생하였습니다.');
            }
        } catch (error) {
            console.error('서버 통신 오류', error);
        }
    };

    return (
        <>
            {isLoading ? (
                <LoadingNog />
            ) : (
                <>
                    <div className={common.background}>
                        {/* <div className={style.title_area}>
          <NavLink to="/">NOG</NavLink>
          <div>회원정보</div>
        </div> */}
                        <Header sub_title="내 정보" />
                        <div className={style.main_area}>
                            <div className={style.userId}>
                                <div>{userId}</div>
                            </div>
                            <div className={style.info_main}>
                                <div className={style.info_main_title}>기본 정보</div>
                                <div className={style.info_main_detail}>
                                    <div>{userName}</div>
                                </div>

                                {/* 이메일 */}
                                <div className={style.info_main_detail}>
                                    {editEmail ? (
                                        <>
                                            <input
                                                type="text"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                className={style.input_new}
                                            />
                                            <button onClick={openModal}>인증</button>
                                        </>
                                    ) : (
                                        <>
                                            <div>{userEmail}</div>
                                            <button onClick={editEmailBtn}>수정</button>
                                        </>
                                    )}
                                </div>

                                {/* 휴대폰 번호 */}
                                <div className={style.info_main_detail}>
                                    {editPhone ? (
                                        <input
                                            type="text"
                                            value={newPhone}
                                            onChange={(e) => setNewPhone(e.target.value)}
                                            className={style.input_new}
                                            maxLength="13"
                                            placeholder={userPhone}
                                        />
                                    ) : (
                                        <div>{formatPhone(userPhone)}</div>
                                    )}
                                    {!editPhone ? (
                                        <button onClick={editPhoneBtn}>수정</button>
                                    ) : (
                                        <button onClick={cancelPhoneBtn}>취소</button>
                                    )}
                                </div>

                                <div className={style.info_main_detail}>
                                    <div className={style.divLine}></div>
                                </div>

                                {/* 비밀번호 */}
                                <div className={style.pwd_title}>비밀번호 변경</div>
                                <div className={style.info_main_detail}>
                                    <div className={style.pwdInput_area}>
                                        {editPwd ? (
                                            <input
                                                type="password"
                                                value={newPwd}
                                                onChange={(e) => setNewPwd(e.target.value)}
                                                className={style.input_new}
                                            />
                                        ) : (
                                            <div>***************</div>
                                        )}
                                        {!editPwd ? (
                                            <button onClick={editPwdBtn}>수정</button>
                                        ) : (
                                            <button onClick={cancelPwdBtn}>취소</button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className={style.info_sub}>
                                <div className={style.info_sub_title}>부가 정보</div>

                                {/* 주소 */}
                                <div className={style.info_sub_detail}>
                                    <div className={style.addressInput_area}>
                                        {editAddress ? (
                                            <div className={style.addressInput_area}>
                                                <div className={style.address_fisrt_second_area}>
                                                    <select
                                                        className={style.addressInput}
                                                        onChange={handleChangeElement1}
                                                        value={selectedElement1}
                                                    >
                                                        <option value="">시/도</option>
                                                        {Object.keys(options).map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <select
                                                        className={style.addressInput}
                                                        onChange={(e) => setSelectedElement2(e.target.value)}
                                                        value={selectedElement2}
                                                    >
                                                        <option value="">시/군/구</option>
                                                        {selectedElement1
                                                            ? options[selectedElement1].map((option) => (
                                                                  <option key={option} value={option}>
                                                                      {option}
                                                                  </option>
                                                              ))
                                                            : null}
                                                    </select>
                                                </div>

                                                <div className={style.address_third_area}>
                                                    <input
                                                        type="text"
                                                        name="address3"
                                                        placeholder="상세주소"
                                                        value={selectedElement3}
                                                        onChange={(e) => setSelectedElement3(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                {userAddress1} {userAddress2} {userAddress3}
                                            </div>
                                        )}
                                    </div>
                                    {!editAddress ? (
                                        <button onClick={editAddressBtn}>수정</button>
                                    ) : (
                                        <button onClick={cancelAddressBtn}>취소</button>
                                    )}
                                </div>

                                {/* 가구원 수 */}
                                <div className={style.info_sub_detail}>
                                    <div style={{ marginRight: '5px' }}>가구원 수: </div>
                                    {editHouseNum ? (
                                        <input
                                            type="text"
                                            value={newHouseNum}
                                            onChange={(e) => setNewHouseNum(e.target.value)}
                                            className={`${style.input_new} ${style.input_newHouseNum}`}
                                            maxLength="2"
                                        ></input>
                                    ) : (
                                        <div>{userHouseNum}</div>
                                    )}
                                    <div>명</div>
                                    {!editHouseNum ? (
                                        <button onClick={editHouseNumBtn}>수정</button>
                                    ) : (
                                        <button onClick={cancelHouseNumBtn}>취소</button>
                                    )}
                                </div>
                            </div>

                            {/* 정보 수정 완료 */}
                            <div className={common.btn_area}>
                                <button className={common.themeBgrColor} onClick={handleEdit}>
                                    확인
                                </button>
                            </div>
                            {/* 회원탈퇴 */}
                            <div className={style.delete_account}>
                                <NavLink to="/delete_check">{`회원탈퇴 >`}</NavLink>
                            </div>
                        </div>
                        <BottomNav activeUser={true} />
                    </div>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={() => setModalIsOpen(false)}
                        className={style.custom_modal}
                    >
                        <span className={style.close} onClick={closeModal}>
                            &times;
                        </span>
                        <div className={style.modal_container}>
                            <div className={style.modal_title}>이메일 인증</div>
                            <div className={style.modal_content}>
                                <input
                                    className={style.email_auth}
                                    type="text"
                                    value={emailAuth}
                                    onChange={(e) => setEmailAuth(e.target.value)}
                                    placeholder="인증번호"
                                    maxLength="8"
                                />
                                <button onClick={handleVerify} className={style.btn_auth}>
                                    인증완료
                                </button>
                            </div>
                        </div>
                    </Modal>
                    <ChatBot />
                </>
            )}
        </>
    );
}

export default EditUserInfo;
