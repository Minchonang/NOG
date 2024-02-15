import { NavLink } from "react-router-dom";

// import icon_bot from "../../chatTest/bot_NOG.png";
import style from "../css/Chatbot.module.css";

function ChatBot({ login }) {
	const bot_NOG =
		"https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Fa8f094af-6e08-4df8-9b2b-f7f4eaa9e42d%2Ff7cdc086-7672-4a43-abb2-b9d65af8459e%2FUntitled.png?table=block&id=e8e6ed65-29ba-474f-8dc1-3ba04ddebe3d&spaceId=a8f094af-6e08-4df8-9b2b-f7f4eaa9e42d&width=2000&userId=6519112b-50fc-4c6c-b9e6-174d9c3dbad1&cache=v2";

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
