// ChatTest.jsx
import { useState, useEffect, Fragment } from "react";
import { NavLink } from "react-router-dom";
import io from "socket.io-client";

// import bot_NOG from "./bot_NOG.png";
// import bot_NOG from "./bot_NOG.svg";
import style from "./css/ChatTest.module.css";
import BottomNav from "../common/jsx/BottomNav";

// const socket = io("http://192.168.0.58:5000"); // iot_AI
// const socket = io("http://192.168.0.67:5000"); // kepko
const socket = io("http://192.168.0.87:5000"); // 희성
// const socket = io("172.20.10.5");
// 오늘 점심 -> 이미지 테스트
// 전기 요금 계산 -> 링크

const ChatTest = () => {
	const bot_NOG =
		"https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Fa8f094af-6e08-4df8-9b2b-f7f4eaa9e42d%2Ff7cdc086-7672-4a43-abb2-b9d65af8459e%2FUntitled.png?table=block&id=e8e6ed65-29ba-474f-8dc1-3ba04ddebe3d&spaceId=a8f094af-6e08-4df8-9b2b-f7f4eaa9e42d&width=2000&userId=6519112b-50fc-4c6c-b9e6-174d9c3dbad1&cache=v2";

	const sayHello = `안녕하세요, 저는 노지입니다.😊\n저는 여러분을 돕는 것을 좋아하고\n에너지 낭비를 싫어해요.🥺\n저와 같이 에너지 절약을 통해 깨끗한 지구를 만들어 봐요.🌳\n\n무엇이든지 물어보세요.\n예시1. 넌 누구야?\n예시2. 에어컨 온도 조절 해줘`;

	// const [chatImage, setChatImage] = useState('');
	const [query, setQuery] = useState("");
	const [chatHistory, setChatHistory] = useState([]); // 채팅 기록을 저장할 상태 추가
	const inputLength = query.length > 0;

	// 채팅 내용 전송
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
	
	// enter 입력 시 채팅 내용 전송
	const pressEnter = () => {
		if (window.event.keyCode === 13) {
			handleQuery();
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
		<>
			<div className={style.background}>
				<div className={style.title_area}>
					<NavLink to="/">NOG</NavLink>
					<div>Chatbot</div>
				</div>

				<div className={style.chatContainer} id="chatContainer">
					{/* 챗봇 첫인사 */}
					<div className={`${style.msg_area} ${style.botText_area}`}>
						<img src={bot_NOG} className={style.icon_chatbot} alt="botIcon" />
						<div>{sayHello}</div>
					</div>

					{chatHistory.map((chat, index) => (
						<Fragment key={index}>
							{/* 유저 텍스트 영역 */}
							<div
								className={`${style.msg_area} ${style.userText_area}`}
								key={index}
							>
								<div>{chat.question}</div>
							</div>

							{/* 봇 답변 영역 */}
							{chat.answer && (
								<div className={`${style.msg_area} ${style.botText_area}`}>
									{/* 봇 아이콘(프로필) */}
									<img
										src={bot_NOG}
										className={style.icon_chatbot}
										alt="botIcon"
									/>
									<div>
										<span>{chat.answer}</span>
										{/* 사진을 보냈는지 확인하고, http/https로 시작하는지 여부 확인 */}
										{chat.img &&
											(/(http|https):\/\//.test(chat.img) ? (
												// https	인 경우 이미지인지 여부 확인
												/(.jpg|.jpeg|.png|.gif)$/.test(
													chat.img.toLowerCase()
												) ? (
													<img
														src={chat.img}
														className={style.botChat_img}
														alt="chatImage"
													/>
												) : (
													// 링크인 경우
													<a href={chat.img}>{`\n\n바로가기`}</a>
												)
											) : (
												// 챗봇 텍스트
												<span>{chat.img}</span>
											))}
									</div>
								</div>
							)}
						</Fragment>
					))}
				</div>

				{/* 유저 입력 */}
				<div className={style.input_area}>
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={pressEnter}
					/>
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
