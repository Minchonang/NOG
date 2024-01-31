import { useState } from "react";
import { NavLink } from "react-router-dom";
import common from "../common/css/common.module.css";
import style from "./css/FindPw.module.css";
import { API_BASE_URL } from "../../App.js";

function FindPw() {
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [emailAuth, setEmailAuth] = useState("");

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
        setEmailAuth(json.AUTHKEY);
        console.log(json.AUTHKEY); // Use setNumber to update the state
      })
      .catch((error) => {
        console.error("Error fetching email:", error);
      });
  };
  return (
    <>
      <div className={common.background}>
        <div className={common.main_area}>
          <div className={common.title_area}>
            <NavLink to="/">Jada</NavLink>
          </div>
          <label className={style.guide_label}>
            등록된 이름, 전화번호, 이메일을 입력하세요.
          </label>
          <div className={common.input_area}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="이름 입력"
              maxLength="20"
            />
            <input
              type="number"
              value={userPhone}
              onChange={(e) => setUserPhone(e.taerg.value)}
              placeholder="전화번호 입력"
              maxLength="11"
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
              onChange={(e) => setEmailAuth(e.target.value)}
              placeholder="인증번호"
              maxLength="6"
            />
          </div>
          <div className={common.btn_area}>
            <button className={common.themeBgrColor}>비밀번호 찾기</button>
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
