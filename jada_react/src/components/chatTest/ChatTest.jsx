// ChatTest.jsx
import React, { useState, useEffect, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

import Header from '../common/jsx/Header';
import BottomNav from '../common/jsx/BottomNav';
import common from '../common/css/common.module.css';
import style from './css/ChatTest.module.css';

// const socket = io("http://192.168.0.19:5001"); // 희성
const socket = io('http://43.203.120.82:5000');

const ChatTest = () => {
   const bot_NOG =
      'https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Fa8f094af-6e08-4df8-9b2b-f7f4eaa9e42d%2Ff7cdc086-7672-4a43-abb2-b9d65af8459e%2FUntitled.png?table=block&id=e8e6ed65-29ba-474f-8dc1-3ba04ddebe3d&spaceId=a8f094af-6e08-4df8-9b2b-f7f4eaa9e42d&width=2000&userId=6519112b-50fc-4c6c-b9e6-174d9c3dbad1&cache=v2';

   const sayHello = `안녕하세요, 저는 노지입니다.😊\n저는 여러분을 돕는 것을 좋아하고\n에너지 낭비를 싫어해요.🥺\n저와 같이 에너지 절약을 통해 깨끗한 지구를 만들어 봐요.🌳\n\n무엇이든지 물어보세요.\n예시1. 넌 누구야?\n예시2. 에어컨 온도 조절 해줘`;

   const [query, setQuery] = useState('');
   const [chatHistory, setChatHistory] = useState([]); // 채팅 기록을 저장할 상태 추가
   const inputLength = query.length > 0;
   const [userid, setuserid] = useState('');
   const [result, setResult] = useState('');

   // user_id를 통해 전력사용량 가져오기
   useEffect(() => {
      const id = sessionStorage.getItem('user_id');
      setuserid(id);
   }, []);

   useEffect(() => {
      // userid 상태가 업데이트될 때마다 로그 출력
      // console.log('userid 상태가 업데이트 되었습니다.: ', userid);
   }, [userid]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            // userid 상태가 업데이트될 때마다 Flask 서버에 요청
            if (userid) {
               const response = await axios.post('http://43.203.120.82:5000/chat_userdata', {
                  user_id: userid,
               });

               const resultString = response.data;
               // result를 배열로 변환
               const resultArray = JSON.parse(resultString);
               // console.log('받아온 resultArray: ', resultArray); // 받아온 데이터 확인

               let totalDailyUsage = 0;
               resultArray.forEach((data) => {
                  totalDailyUsage += data.daily_usage;
               });

               const roundedTotalDailyUsage = parseFloat(totalDailyUsage.toFixed(2));
               console.log('총 사용량:', roundedTotalDailyUsage); // 총 사용량 출력
               setResult(roundedTotalDailyUsage);

               // 받아온 데이터를 처리하거나 상태에 저장하는 로직을 추가
            }
         } catch (error) {
            console.error('Error fetching data:', error.message);
         }
      };

      fetchData();
   }, [userid]);

   // 기본 챗봇 socket 기능
   const handleQuery = () => {
      if (query.trim() !== '') {
         // query 값이 비어있지 않은 경우에만 처리
         socket.emit('message', { Query: query, BotType: 'TEST' });
         setChatHistory([...chatHistory, { question: query, answer: '', img: '', login_check: '' }]);
         setQuery(''); // 질문 보낸 후 query 초기화
      }
   };

   // enter 입력 시 채팅 내용 전송
   const pressEnter = () => {
      if (window.event.keyCode === 13) {
         handleQuery();
      }
   };

   socket.on('message', (data) => {
      setChatHistory((prevHistory) => {
         const updatedHistory = [...prevHistory];
         const lastIndex = updatedHistory.length - 1;
         updatedHistory[lastIndex] = {
            ...updatedHistory[lastIndex],
            answer: data.Answer,
            img: data.Img,
            login_check: data.Login_Check,
         };
         return updatedHistory;
      });
   });

   // 컴포넌트가 마운트될 때마다 스크롤을 가장 아래로 조정
   useEffect(() => {
      const chatContainer = document.getElementById('chatContainer');
      chatContainer.scrollTop = chatContainer.scrollHeight;
   }, [chatHistory]);

   // console.log(userid);
   // console.log(result);

   return (
      <>
         <div className={common.background}>
            <Header sub_title="ChatBot" />
            {/* <div className={style.title_area}>
          <NavLink to="/">NOG</NavLink>
          <div>Chatbot</div>
        </div> */}

            <div className={style.chatContainer} id="chatContainer">
               {/* 챗봇 첫인사 */}
               <div className={`${style.msg_area} ${style.botText_area}`}>
                  <img src={bot_NOG} className={style.icon_chatbot} alt="botIcon" />
                  <div>{sayHello}</div>
               </div>

               {chatHistory.map((chat, index) => (
                  <Fragment key={index}>
                     {/* 유저 텍스트 영역 */}
                     <div className={`${style.msg_area} ${style.userText_area}`} key={index}>
                        <div>{chat.question}</div>
                     </div>

                     {/* 봇 답변 영역 */}
                     {chat.answer && (
                        <div className={`${style.msg_area} ${style.botText_area}`}>
                           {/* 봇 아이콘(프로필) */}
                           <img src={bot_NOG} className={style.icon_chatbot} alt="botIcon" />
                           <div>
                              {/* chat.Img가 1인 경우 result 출력, 그렇지 않으면 chat.answer 출력 */}
                              {userid ? (
                                 chat.img == 'chat_result' ? (
                                    `이번달 ${userid}님의 전력량은` + result + 'kwh 입니다'
                                 ) : (
                                    chat.answer
                                 )
                              ) : chat.login_check !== '1' ? (
                                 chat.answer
                              ) : (
                                 <>
                                    <div style={{ padding: '0' }}>로그인 후 이용가능합니다.</div>
                                    <NavLink to="/login">{`\n로그인 >`}</NavLink>
                                 </>
                              )}

                              {userid ? (
                                 // userid가 있을때
                                 chat.login_check === '1' ? (
                                    // 로그인 상태일 때
                                    chat.img.startsWith('/') ? (
                                       // navlink
                                       <NavLink to={chat.img}>{`\n\n바로가기`}</NavLink>
                                    ) : chat.img == 'chat_result' ? (
                                       ' '
                                    ) : (
                                       chat.img
                                    )
                                 ) : // 로그인 상태이지만 login_check가 1이 아닐 때
                                 /(http|https):\/\//.test(chat.img) ? (
                                    // 이미지 확인
                                    /(.jpg|.jpeg|.png|.gif)$/.test(chat.img.toLowerCase()) ? (
                                       <img src={chat.img} className={style.botChat_img} alt="chatImage" />
                                    ) : // 링크인 경우(http 제거/ 제거 안하는 것)
                                    chat.img.startsWith('http/') ? (
                                       <NavLink to={chat.img.split('/').slice(3).join('/')}>{`\n\n바로가기`}</NavLink>
                                    ) : (
                                       <a href={chat.img}>{`\n\n바로가기`}</a>
                                    )
                                 ) : (
                                    // 텍스트
                                    <span>{chat.img}</span>
                                 )
                              ) : // userid가 없을 때
                              chat.login_check === '1' ? (
                                 // login_check가 1일 때
                                 ' '
                              ) : // userid가 없고 login_check도 1이 아닐 때
                              /(http|https):\/\//.test(chat.img) ? (
                                 // 이미지 확인
                                 /(.jpg|.jpeg|.png|.gif)$/.test(chat.img.toLowerCase()) ? (
                                    <img src={chat.img} className={style.botChat_img} alt="chatImage" />
                                 ) : // 링크인 경우(http 제거/ 제거 안하는 것)
                                 chat.img.startsWith('http/') ? (
                                    <NavLink to={chat.img.split('/').slice(3).join('/')}>{`\n\n바로가기`}</NavLink>
                                 ) : (
                                    <a href={chat.img}>{`\n\n바로가기`}</a>
                                 )
                              ) : (
                                 // 텍스트
                                 <span>{chat.img}</span>
                              )}
                           </div>
                        </div>
                     )}
                  </Fragment>
               ))}
            </div>

            {/* 유저 입력 */}
            <div className={style.input_area}>
               <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={pressEnter} />
               <button
                  className={inputLength ? style.activeBtn : style.deactivateBtn}
                  onClick={handleQuery}
                  disabled={!inputLength}
               >
                  전송
               </button>
            </div>

            <BottomNav />
         </div>
      </>
   );
};
export default ChatTest;
