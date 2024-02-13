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
    const [comment, setComment] = useState('');
    const [content, setContent] = useState('');
    const [num, setNum] = useState('');

    const userId = sessionStorage.getItem('user_id');

    useEffect(() => {
        // boardId가 유효한 경우에만 요청을 보냄
        if (boardId !== undefined) {
            getBoardDetail();
        }
    }, [boardId]);

    // 게시글 상세정보 조회
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

    // 댓글 저장 및 리스트 조회
    const serverlink = async () => {
        const commentDto = {
            userId: userId,
            content: content,
            boardId: boardId,
        };
        try {
            // 서버로 데이터 전송 - 경로 수정 필요
            const response = await fetch(`${API_BASE_URL}/api/board/getComment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentDto),
            });

            if (response.ok) {
                alert('댓글 작성이 완료되었습니다.');
                const result = await response.json();
                setComment(result);
                // 입력값 초기화
                setContent('');
                setNum(num + 1);
            } else {
                console.log('댓글달기 실패');
                alert('댓글달기 실패');
            }
        } catch (error) {
            console.error('서버 통신 오류', error);
        }
    };
    console.log(comment);
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
                        <div className={style.line}>{/* <div>댓글</div> */}</div>
                        <div className={style.commentContainer}>
                            <div className={style.input_area}>
                                <input
                                    type="text"
                                    className={style.input}
                                    value={content}
                                    placeholder="댓글을 입력해주세요."
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                            <div className={style.btn_area}>
                                <button onClick={serverlink}>댓글달기</button>
                            </div>
                        </div>
                        {comment ? (
                            <div className={style.commentList}>
                                <table className={style.commentTable}>
                                    <thead>
                                        <tr className={style.commentTitle}>
                                            {/* <th>No</th> */}
                                            <th>답변 {comment.length}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comment.map((comment) => (
                                            <tr className={style.commentContent} key={comment.commentId}>
                                                <td>{num}</td>
                                                <td>{comment.content}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <></>
                        )}
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
