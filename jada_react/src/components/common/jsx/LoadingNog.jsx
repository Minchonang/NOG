import style from "../css/Loading.module.css";

const Loading = () => {
	const icon_nog = `https://private-user-images.githubusercontent.com/84889516/307254808-95620a80-5617-4b84-bc3f-019040d7fe83.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDg2NzY0NDEsIm5iZiI6MTcwODY3NjE0MSwicGF0aCI6Ii84NDg4OTUxNi8zMDcyNTQ4MDgtOTU2MjBhODAtNTYxNy00Yjg0LWJjM2YtMDE5MDQwZDdmZTgzLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMjMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjIzVDA4MTU0MVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWQ2MTdkN2JjZDgyMjhiNWE3ZTJmODJmOGZjNGY0ZTFjZmUxYWE2NmE3Nzc0MzY2ZDE3MGU5YTg3ZGQ3N2Y5NDYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.bDcGH19ULplJMmrOwmbElChQPtpRvj1KUdF_UdES4Cc`;
	return (
		<>
			<div className={style.chatbot_box}>
				<img
					className={`${style.chatbotImg} ${style.bounce}`}
					src={icon_nog}
					alt="ChatBot_wink"
				/>
			</div>
		</>
	);
};

export default Loading;
