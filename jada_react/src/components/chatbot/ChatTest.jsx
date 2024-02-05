// ChatTest.jsx
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import questionImage from "./nogimg.png";
import common from "../common/css/common.module.css";
import style from "./css/ChatTest.module.css";
import { NavLink } from "react-router-dom";

// Flask 서버 주소에 맞게 변경
const socket = io("http://192.168.0.67:5000");
// const socket = io("http://localhost:5000");

const ChatTest = () => {
  // const [chatImage, setChatImage] = useState('');
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // 채팅 기록을 저장할 상태 추가

  const handleQuery = () => {
    if (query.trim() !== "") {
      // query 값이 비어있지 않은 경우에만 처리
      socket.emit("message", { Query: query, BotType: "TEST" });
      setChatHistory([
        ...chatHistory,
        { question: query, answer: "", img: "" },
      ]);
      setQuery(""); // 질문 보낸 후 query 초기화
    }
  };

  socket.on("message", (data) => {
    setChatHistory((prevHistory) => {
      const updatedHistory = [...prevHistory];
      const lastIndex = updatedHistory.length - 1;
      updatedHistory[lastIndex] = {
        ...updatedHistory[lastIndex],
        answer: data.Answer,
        img: data.Img,
      };
      return updatedHistory;
    });
  });

  // 컴포넌트가 마운트될 때마다 스크롤을 가장 아래로 조정
  useEffect(() => {
    const chatContainer = document.getElementById("chatContainer");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [chatHistory]);

  return (
    <div className={style.background}>
      <div className={style.title_area}>
        <NavLink to="/home">NOG</NavLink>
        <div>Chatbot</div>
      </div>

      <div className={style.chatContainer} id="chatContainer">
        <div>
          <img
            src={questionImage}
            style={{
              maxWidth: "50px",
              height: "50px",
              marginLeft: "1em",
              marginTop: "4em",
            }}
          ></img>

          <div className={style.helloNog}>
            안녕하세요
            <br /> 저는 챗봇 노지입니다😊
            <br />
            여러분을 돕는 것을 좋아하고
            <br />
            에너지 낭비를 싫어해요🥺
            <br />
            저와 같이 에너지 절약을 통해
            <br /> 깨끗한 지구를 만들어봐요🌳
            <br />
            <br />
            무엇이든지 물어보세요
            <br />
            예시1. 넌 누구야?
            <br />
            예시2. 에어컨 온도조절해줘
          </div>
        </div>

        {chatHistory.map((chat, index) => (
          <div key={index}>
            <div className={style.question_box}>{chat.question}</div>

            {chat.answer && (
              <div style={{ textAlign: "left" }}>
                <img
                  src={questionImage}
                  style={{
                    maxWidth: "50px",
                    height: "50px",
                    marginLeft: "1rem",
                  }}
                ></img>
                <p
                  style={{
                    backgroundColor: "#FFCF81",
                    padding: "1rem",
                    marginBottom: "2rem",
                    marginLeft: "1rem",
                    marginRight: "10rem",
                  }}
                >
                  {chat.answer}
                  {chat.img && (
                    <span>
                      {/(http|https):\/\//.test(chat.img) ? (
                        <a
                          href={chat.img}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {/(.jpg|.jpeg|.png|.gif)$/.test(
                            chat.img.toLowerCase()
                          ) ? (
                            <img
                              src={chat.img}
                              style={{ maxWidth: "100%", height: "100%" }}
                              alt="chat image"
                            />
                          ) : (
                            <span>{chat.img}</span>
                          )}
                        </a>
                      ) : (
                        <span>{chat.img}</span>
                      )}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={style.input_area}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className={style.send_btn}
          onClick={handleQuery}
          disabled={!query.trim()}
        >
          ⭐
        </button>
      </div>
    </div>
  );
};

export default ChatTest;
