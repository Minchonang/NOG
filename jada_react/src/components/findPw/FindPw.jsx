import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import common from '../common/css/common.module.css';
import style from './css/FindPw.module.css';
import { API_BASE_URL } from '../../App.js';
import BottomNav from '../common/jsx/BottomNav.jsx';

function FindPw() {
    const idRef = useRef();
    useEffect(() => {
        setTimeout(() => {
            if (idRef.current) {
                idRef.current.focus();
            }
        }, 500);
    }, []);

    const [userId, setUserId] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [emailAuth, setEmailAuth] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [authkey, setAuthkey] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [newPwdConfirm, setNewPwdConfirm] = useState('');

    const handleVerify = (e) => {
        e.preventDefault();

        if (!authkey) {
            alert('인증번호를 먼저 요청하세요.');
            return;
        }
        if (authkey === emailAuth) {
            setIsVerified(true);
        } else {
            setIsVerified(false);
            alert('인증번호가 일치하지 않습니다.');
        }
    };

    const handleJoin = async (e) => {
        e.preventDefault();

        if (!isVerified) {
            alert('이메일 인증을 먼저 완료하세요.');
            return;
        }
    };

    // 이메일 인증
    const sendEmail = (e) => {
        e.preventDefault();
        console.log(userEmail);
        const data = {
            EMAIL: userEmail,
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

    const handleFindPwd = async (e) => {
        try {
            // 아이디 찾기 버튼 클릭 시 서버로 요청 보내기
            const response = await fetch(`${API_BASE_URL}/api/userinfo/find-pwd`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userId,
                    email: userEmail,
                }),
            });

            if (response.ok) {
                // 서버에서 해당 이름, 이메일을 찾으면 해당 아이디 반환
                const data = await response.text();
                alert(data);
                console.log('본인인증 성공:', data);
                handleVerify(e);
            } else {
                console.log('본인인증 실패:', response.status);
                alert('회원정보가 일치하지 않습니다.');
            }
        } catch (error) {
            console.error('본인인증 중 오류 발생:', error);
        }
    };

    const handleResetPwd = async (e) => {
        e.preventDefault();

        if (!isVerified) {
            alert('이메일 인증을 먼저 완료하세요.');
            return;
        }

        // 두 비밀번호가 일치하는지 확인합니다.
        if (newPwd !== newPwdConfirm) {
            alert('입력한 비밀번호가 일치하지 않습니다.');
            return;
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/userinfo/pwdforget`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userId,
                    email: userEmail,
                    newPassword: newPwd,
                }),
            });

            if (response.ok) {
                alert('비밀번호가 변경되었습니다.');
                window.location.href = '/login';
            } else {
                console.log('비밀번호 재설정 실패:', response.status);
            }
        } catch (error) {
            console.error('비밀번호 재설정 중 오류 발생:', error);
        }
    };
    return (
        <>
            <div className={common.background}>
                <div className={common.main_area} onSubmit={handleJoin}>
                    <div className={common.title_area}>
                        <NavLink to="/">NOG</NavLink>
                    </div>
                    <label className={style.guide_label}>등록된 아이디, 이메일을 입력하세요.</label>
                    <div className={common.input_area}>
                        {!isVerified ? (
                            // 인증이 완료되지 않았을 때
                            <>
                                <input
                                    type="text"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    ref={idRef}
                                    placeholder="아이디 입력"
                                    maxLength="20"
                                />
                                <div className={style.inputEmail_area}>
                                    <input
                                        type="text"
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        placeholder="이메일 입력"
                                        maxLength="25"
                                    />
                                    <button className={common.themeBgrColor} onClick={sendEmail}>
                                        인증하기
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={emailAuth}
                                    onChange={(e) => setEmailAuth(e.target.value)}
                                    placeholder="인증번호"
                                    maxLength="8"
                                />
                                <div className={common.btn_area}>
                                    <button className={common.themeBgrColor} onClick={handleFindPwd}>
                                        다음
                                    </button>
                                </div>
                            </>
                        ) : (
                            // 인증이 완료되었을 때
                            <>
                                <input
                                    type="password"
                                    value={newPwd}
                                    onChange={(e) => setNewPwd(e.target.value)}
                                    placeholder="새 비밀번호 입력"
                                    maxLength="20"
                                />
                                <input
                                    type="password"
                                    value={newPwdConfirm}
                                    onChange={(e) => setNewPwdConfirm(e.target.value)}
                                    placeholder="비밀번호 확인"
                                    maxLength="20"
                                />
                                <div className={common.btn_area}>
                                    <button className={common.themeBgrColor} onClick={handleResetPwd}>
                                        비밀번호 재설정하기
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className={style.findId_area}>
                        <NavLink to="/find_id">아이디를 잊으셨나요?</NavLink>
                    </div>
                </div>
                <BottomNav />
            </div>
        </>
    );
}

export default FindPw;
