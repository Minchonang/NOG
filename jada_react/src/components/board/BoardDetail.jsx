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

    const userId = sessionStorage.getItem('user_id');
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
            <Header sub_title="내 문의사항 정보" />

            <div className={style.main_area}>
                {board ? (
                    <>
                        <div className={style.boardContainer}>
                            <div className={style.title}>
                                <div>{board.title}</div>
                            </div>
                            <div className={style.subtitle}>
                                <div>NO : {board.boardId}</div>
                                <div>작성자 : {userId}</div>
                                <div>{new Date(board.writeDate).toLocaleDateString('ko-KR')}</div>
                            </div>
                            <div className={style.content}>
                                <div>{board.boardCategory}</div>
                                <div>{board.content}</div>
                            </div>
                        </div>
                        <hr />
                        <div className={style.commentContainer}>
                            <div className={common.input_area}>
                                <input type="text" className={style.input} />
                            </div>
                            <div className={common.btn_area}>
                                <button type="submit">댓글달기</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            <BottomNav />
        </div>
    );
}

export default BoardDetail;
