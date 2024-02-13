import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../App.js';
import BottomNav from '../common/jsx/BottomNav';
import Header from '../common/jsx/Header';
import common from '../common/css/common.module.css';
import style from './css/BoardDetail.module.css';

function BoardDetail() {
    const [board, setBoard] = useState(null);
    const { boardId } = useParams();

    useEffect(() => {
        // boardId가 유효한 경우에만 요청을 보냄
        if (boardId !== undefined) {
            getBoardDetail();
        }
    }, [boardId]);

    const getBoardDetail = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/board/boardDetail?boardId=${boardId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response Status:', response.status);

            if (response.ok) {
                console.log(boardId);
                const result = await response.json();
                console.log('Response Data:', result); // Add this line
                setBoard(result);
            } else {
                // console.log("Server error:", await response.text());
                alert('게시글 조회 중 서버 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('서버 통신 오류', error);
            alert('서버 통신 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={common.background}>
            <Header sub_title="내 정보" />

            <div className={style.main_area}>
                <div className={style.title}>
                    <div>게시글 상세 정보</div>
                </div>
                <div className={style.content}>
                    {board ? (
                        <>
                            <h1>{board.title}</h1>
                            <p>{board.content}</p>
                            {/* Additional information */}
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
            <BottomNav />
        </div>
    );
}

export default BoardDetail;
