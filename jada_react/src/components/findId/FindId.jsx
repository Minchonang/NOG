import { useState } from "react";
import { NavLink } from "react-router-dom";
import common from "../common/css/common.module.css";
import style from "./css/FindId.module.css";
import { API_BASE_URL } from "../../App.js";

function FindId() {
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [emailAuth, setEmailAuth] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [authkey, setAuthkey] = useState("");

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
            등록된 이름, 이메일을 입력하세요.
          </label>
          <div className={common.input_area}>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
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
            <div className={style.inputEmail_area}>
              <input
                type="text"
                value={emailAuth}
                onChange={(e) => setEmailAuth(e.target.value)}
                placeholder="인증번호 입력"
                maxLength="8"
              />
              <button className={common.themeBgrColor} onClick={handleVerify}>
                인증확인
              </button>
            </div>
          </div>
          <div className={common.btn_area}>
            <button className={common.themeBgrColor}>아이디 찾기</button>
          </div>
          <div className={style.findPw_area}>
            <NavLink to="/find_pw">비밀번호를 잊으셨나요?</NavLink>
          </div>
        </div>
      </div>
    </>
  );
}
export default FindId;
