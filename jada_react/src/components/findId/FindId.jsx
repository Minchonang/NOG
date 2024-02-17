import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import common from "../common/css/common.module.css";
import style from "./css/FindId.module.css";
import { API_BASE_URL } from "../../App.js";
// import BottomNav from "../common/jsx/BottomNav.jsx";

function FindId() {
  const nameRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      if (nameRef.current) {
        nameRef.current.focus();
      }
    }, 500);
  }, []);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [emailAuth, setEmailAuth] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [authkey, setAuthkey] = useState("");

  const handleFindId = async (e) => {
    try {
      // 아이디 찾기 버튼 클릭 시 서버로 요청 보내기
      const response = await fetch(`${API_BASE_URL}/api/userinfo/find-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
        }),
      });

      if (response.ok) {
        // 서버에서 해당 이름, 이메일을 찾으면 해당 아이디 반환
        const data = await response.text();
        console.log("아이디 찾기 성공:", data);
        handleVerify(e);
        alert("회원님의 아이디는 " + data + " 입니다.");
        window.location.href = "/login";
      } else {
        alert("회원정보가 일치하지 않습니다..");
        console.log("아이디 찾기 실패:", response.status);
      }
    } catch (error) {
      console.error("아이디 찾기 중 오류 발생:", error);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      alert("이메일 인증을 먼저 완료하세요.");
      return;
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();
    console.log(userEmail);
    const data = {
      EMAIL: userEmail,
    };

    fetch(`${API_BASE_URL}/PwFind/Email`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      mode: "cors",
    })
      .then((res) => res.json())
      .then((json) => {
        setAuthkey(json.AUTHKEY);
        console.log(json.AUTHKEY); // Use setNumber to update the state
      })
      .catch((error) => {
        console.error("Error fetching email:", error);
      });
  };

  const handleVerify = (e) => {
    e.preventDefault();
    console.log(emailAuth);

    if (!authkey) {
      alert("인증번호를 먼저 요청하세요.");
      return;
    }
    if (authkey === emailAuth) {
      setIsVerified(true);
      alert("인증되었습니다.");
    } else {
      setIsVerified(false);
      alert("인증번호가 일치하지 않습니다.");
    }
  };

  return (
    <>
      <div className={common.background}>
        <div className={common.main_area} onSubmit={handleJoin}>
          <div className={common.title_area}>
            <NavLink to="/">NOG</NavLink>
          </div>
          <label className={style.guide_label}>
            등록된 이름, 이메일을 입력하세요.
          </label>
          <div className={common.input_area}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              ref={nameRef}
              placeholder="이름 입력"
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
          </div>
          <div className={common.btn_area}>
            <button className={common.themeBgrColor} onClick={handleFindId}>
              아이디 찾기
            </button>
          </div>
          <div className={style.findPw_area}>
            <NavLink to="/find_pw">비밀번호를 잊으셨나요?</NavLink>
          </div>
        </div>
        {/* <BottomNav /> */}
      </div>
    </>
  );
}
export default FindId;
