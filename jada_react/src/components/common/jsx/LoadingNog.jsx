import icon_bot from '../../chatTest/bot_NOG.png';
import icon_nog from '../../chatTest/winkNOG.png';
import style from '../css/Loading.module.css';

const Loading = () => {
    return (
        <>
            <div className={style.chatbot_box}>
                <img className={`${style.chatbotImg} ${style.bounce}`} src={icon_nog} alt="ChatBot" />
            </div>
        </>
    );
};

export default Loading;
