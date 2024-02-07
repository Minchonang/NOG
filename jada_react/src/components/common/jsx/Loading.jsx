import icon_bot from '../../chatTest/bot_NOG.png';
import style from '../css/Loading.module.css';

const Loading = () => {
    return (
        <>
            <div className={style.logo}>
                <div className={style.logo_nog}>NOG</div>
                <div className={style.logo_text}>New Our Global.</div>
            </div>
            <div className={style.loading_box}>
                <img className={`${style.chatbotImg} ${style.bounce}`} src={icon_bot} alt="ChatBot" />
            </div>
        </>
    );
};

export default Loading;
