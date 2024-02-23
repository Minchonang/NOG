import { NavLink } from "react-router-dom";
import style from "../css/Chatbot.module.css";

function ChatBot({ login }) {
	const bot_NOG = `https://private-user-images.githubusercontent.com/84889516/307254633-a8e3748e-5508-407f-bb71-0fce40637d67.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDg2NzU0OTIsIm5iZiI6MTcwODY3NTE5MiwicGF0aCI6Ii84NDg4OTUxNi8zMDcyNTQ2MzMtYThlMzc0OGUtNTUwOC00MDdmLWJiNzEtMGZjZTQwNjM3ZDY3LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMjMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjIzVDA3NTk1MlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWFjMGE5MTkzNDNjMTNlYWU1ZmU0ODkyM2VmMmVjYmZmODljZTNlMDA4MDc3ZDU5ZmNiY2RmZmNmOTIwNWNjNzgmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.vaOGJMFtHYDc6rCz8-XtRoidhL-uQ6RKpHBARfkOj1Q`;
	return (
		<>
			<NavLink
				to="/chatbot"
				className={`${style.hidden} ${login ? style.loginPosition : style.chatbotImg}`}
			>
				<img
					className={`${login ? style.loginPosition : style.chatbotImg} ${style.bounce} ${style.hidden}`}
					src={bot_NOG}
					alt="ChatBot"
				/>
			</NavLink>
		</>
	);
}

export default ChatBot;
