import style from '../css/Loading.module.css';

const Loading = () => {
    return (
        <>
            <div className={style.logo_box}>
                <div className={style.logo}>
                    <div className={style.logo_nog}>NOG</div>
                    <div className={style.logo_text}>New Our Global.</div>
                </div>
            </div>
        </>
    );
};

export default Loading;
