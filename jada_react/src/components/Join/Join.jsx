import React, {useState} from "react";

import styles from "./css/Join.module.css"; 
import { API_BASE_URL } from '../../App.js';

function Join() {
    const [formData, setFormData] = useState({
        email: '',
        id: '',
        password: '',
        name: '',
        phone: '',
        address: '',
        house_num: ''
        // house_square:''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleJoin = async (e) => {
        e.preventDefault();
    
        try {
            // JoinUserDto와 유사한 구조를 가진 데이터로 변환
            const joinUserDto = {
                email: formData.email,
                id: formData.id,
                password: formData.password,
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                houseNum: formData.house_num,
                // houseSquare: formData.house_square, // 만약 사용할 경우
            };
            // 서버로 데이터 전송
            const response = await fetch(`${API_BASE_URL}/api/userinfo/join`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',

                },
                body: JSON.stringify(joinUserDto),
            });
    
            if (response.ok) {
                console.log('회원가입 성공');
            } else {
                console.error('회원가입 실패');
            }
        } catch(error) {
            console.error('서버 통신 오류', error);
        }
    };

    return (
        <div className={styles.container}>
            {/* <img className={styles.logoImg} src="" alt="로고" /> */}
            <div className={styles.form} onSubmit={handleJoin}>
                <div className={styles.joinTitle}>회원가입</div>
                <div className={styles.inputWithButton}>
                    <input className={styles.email} type="text" name="email" placeholder="이메일 주소" value={formData.email} onChange={handleInputChange} />
                    <button className={styles.certification}>인증하기</button>
                </div>
                <div className={styles.inputWithButton}>
                    <input className={styles.id} type="text" name="id" placeholder="아이디" value={formData.id} onChange={handleInputChange} />
                    <button className={styles.duplicate}>중복확인</button>
                </div>  
                <input className={styles.pw} type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleInputChange} />
                <input className={styles.pw} type="password" name="password" placeholder="비밀번호 확인" value={formData.password} onChange={handleInputChange} />
                <input className={styles.name} type="text" name="name" placeholder="이름" value={formData.name} onChange={handleInputChange} />
                <input className={styles.phone} type="text" name="phone" placeholder="번호" value={formData.phone} onChange={handleInputChange} />
                <input className={styles.add} type="text" name="address" placeholder="주소" value={formData.address} onChange={handleInputChange} />
                <input className={styles.family} type="text" name="house_num" placeholder="가구원 수" value={formData.house_num} onChange={handleInputChange} />
                {/* <input className={styles.size} type="text" name="house_square" placeholder="평수" value={formData.house_square} onChange={handleInputChange} /> */}
                {/* <input className={styles.admin} type="text" name="admin" placeholder="관리자" /> */}
                <button className={styles.joinBtn} onClick={handleJoin} type="button">가입</button>
            </div>
        </div>
    );
}



export default Join;