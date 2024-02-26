import style from "../css/Loading.module.css";
import icon_nogWink from "../img/bot_NOG/NOG_wink.png";

const Loading = () => {
	return (
		<>
			<div className={style.chatbot_box}>
				<img
					className={`${style.chatbotImg} ${style.bounce}`}
					src={icon_nogWink}
					alt="icon_nogWink"
				/>
			</div>
		</>
	);
};

export default Loading;
