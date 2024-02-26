import { NavLink } from "react-router-dom";
import style from "../css/Chatbot.module.css";
import bot_NOG from "../img/bot_NOG/bot_NOG.png";

function ChatBot({ login }) {
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
