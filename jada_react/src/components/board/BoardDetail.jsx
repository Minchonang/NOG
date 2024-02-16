import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../App.js';
import BottomNav from '../common/jsx/BottomNav';
import Header from '../common/jsx/Header';
import common from '../common/css/common.module.css';
import style from './css/BoardDetail.module.css';
import LoadingNog from '../common/jsx/LoadingNog';
import admin from './img/admin.png';

function BoardDetail() {
    const [board, setBoard] = useState(null);
    const { boardId } = useParams();
    const [comment, setComment] = useState('');
    const [content, setContent] = useState('');
    const [userRole, setUserRole] = useState('');

    // 이전 페이지로 돌아가는 기능
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };

    const userId = sessionStorage.getItem('user_id');

    useEffect(() => {
        // boardId가 유효한 경우에만 요청을 보냄
        if (boardId !== undefined) {
            getBoardDetail();
            getUserRole();
            commentInfo();
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

            // console.log("Response Status:", response.status);
            if (response.ok) {
                const result = await response.json();
                // console.log('Response Data:', result);
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

    // 댓글 저장
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
                // console.log(result);
                window.location.reload(true);
            } else {
                console.log('댓글달기 실패');
                alert('댓글달기 실패');
            }
        } catch (error) {
            console.error('서버 통신 오류', error);
        }
    };

    const getUserRole = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/userinfo/getRole`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: userId,
            });

            if (response.ok) {
                const result = await response.json();
                // console.log('Response Data(role):', result.role);
                setUserRole(result.role);
            } else {
                console.log('서버 오류');
                alert('서버 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('서버 통신 오류', error);
            alert('서버 통신 중 오류가 발생했습니다.');
        }
    };

    // 댓글 조회
    const commentInfo = async () => {
        const commentDto = {
            boardId: boardId,
        };
        try {
            // 서버로 데이터 전송 - 경로 수정 필요
            const response = await fetch(`${API_BASE_URL}/api/board/commentInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commentDto),
            });

            if (response.ok) {
                const result = await response.json();
                setComment(result);
                // console.log(result);
            } else {
                console.log('댓글 조회 실패');
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
                        {/* 문의사항 */}
                        <div className={style.boardContainer}>
                            <div className={style.title}>
                                <div
                                    style={{
                                        fontSize: board.title.length > 12 ? '1.6em' : '2em',
                                    }}
                                >
                                    {board.title}
                                </div>
                            </div>
                            <div className={style.subtitle}>
                                <div>NO : {board.boardId}</div>
                                <div>작성자 : {userId}</div>
                                <div>{`${''} ${new Date(board.writeDate).toLocaleDateString('ko-KR')}`}</div>
                            </div>
                            <div className={style.content}>
                                <div>{board.content}</div>
                            </div>
                        </div>

                        {/* 답변 목록 */}
                        {comment && comment.length > 0 ? (
                            <>
                                {/* 구분선 */}
                                <div className={style.line}></div>
                                <div className={style.commentList}>
                                    <table className={style.commentTable}>
                                        <tbody>
                                            {comment.map((commentItem) => (
                                                <tr className={style.commentContent} key={commentItem.commentId}>
                                                    <img
                                                        src={admin}
                                                        alt="admin"
                                                        style={{
                                                            width: '10%',
                                                            height: '10%',
                                                        }}
                                                    />
                                                    <td className={style.reply_comment}>{commentItem.content}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className={style.btn_area}>
                                    {/* <div
										className={style.goBackBtn}
										onClick={goBack}
									>{`< 뒤로가기`}</div> */}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* 구분선 */}
                                <div className={style.line2}></div>
                                {userRole === 1 ? (
                                    <>
                                        {/* 답변 영역 */}
                                        <div className={style.commentContainer}>
                                            <div className={style.reply}>답변하기</div>
                                            <div className={style.input_area}>
                                                <textarea
                                                    type="text"
                                                    value={content}
                                                    onChange={(e) => setContent(e.target.value)}
                                                    placeholder="내용을 입력하세요."
                                                />
                                            </div>
                                            <div className={style.btn_area}>
                                                {/* <div
													className={style.goBackBtn}
													onClick={goBack}
												>{`< 뒤로가기`}</div> */}
                                                <button onClick={serverlink}>완료</button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <LoadingNog />
                )}
            </div>

            <BottomNav admin={true} />
        </div>
    );
}

export default BoardDetail;
