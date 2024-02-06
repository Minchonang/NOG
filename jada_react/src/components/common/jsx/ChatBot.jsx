import { NavLink } from "react-router-dom";

import icon_bot from "../../chatTest/bot_NOG.png";

import style from "../css/Chatbot.module.css";

function ChatBot() {
	return (
		<>
			<NavLink to="/chatbot">
				<img
					className={`${style.chatbotImg} ${style.bounce}`}
					src={icon_bot}
					alt="ChatBot"
				/>
			</NavLink>
		</>
	);
}

export default ChatBot;
