import { useState } from "react";
import { NavLink } from "react-router-dom";
import common from "../common/css/common.module.css";
import style from "./css/FindPw.module.css";
import { API_BASE_URL } from "../../App.js";

function FindPw() {
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [emailAuth, setEmailAuth] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [authkey, setAuthkey] = useState("");
  const [isNewPasswordFormVisible, setIsNewPasswordFormVisible] =
    useState(false);
  const [newPassword, setNewPassword] = useState("");

  const handleFindPwd = async (e) => {
    handleVerify(e);
    try {
      const response = await fetch(`${API_BASE_URL}/api/userinfo/find-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          email: userEmail,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("본인인증 성공:", data);
      } else {
        console.log("본인인증 실패:", response.status);
      }
    } catch (error) {
      console.error("본인인증 중 오류 발생:", error);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      alert("이메일 인증을 먼저 완료하세요.");
      return;
    }

    if (isNewPasswordFormVisible) {
      console.log("새 비밀번호:", newPassword);
      // 서버로 새로운 비밀번호를 전송하는 등의 로직을 추가하세요.
      // 예를 들어, 새로운 비밀번호를 서버에 전송하는 fetch 로직 등을 여기에 추가할 수 있습니다.
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
        console.log(json.AUTHKEY);
      })
      .catch((error) => {
        console.error("Error fetching email:", error);
      });
  };

  const handleVerify = (e) => {
    e.preventDefault();

    if (!authkey) {
      alert("인증번호를 먼저 요청하세요.");
      return;
    }

    if (authkey === emailAuth) {
      setIsVerified(true);
      alert("인증이 확인되었습니다.");
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
            <NavLink to="/">Jada</NavLink>
          </div>
          <label className={style.guide_label}>
            등록된 아이디, 이메일을 입력하세요.
          </label>
          <div className={common.input_area}>
            {!isVerified ? (
              <>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
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
              </>
            ) : (
              isNewPasswordFormVisible && (
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호 입력"
                />
              )
            )}
            {!isVerified && (
              <input
                type="text"
                value={emailAuth}
                onChange={(e) => setEmailAuth(e.target.value)}
                placeholder="인증번호"
                maxLength="8"
              />
            )}
          </div>
          <div className={common.btn_area}>
            <button className={common.themeBgrColor} onClick={handleFindPwd}>
              본인 인증하기
            </button>
          </div>

          <div className={style.findId_area}>
            <NavLink to="/find_id">아이디를 잊으셨나요?</NavLink>
          </div>
        </div>
      </div>
    </>
  );
}

export default FindPw;
