import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../App.js';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import BottomNav from '../common/jsx/BottomNav';
import Header from '../common/jsx/Header';
import common from '../common/css/common.module.css';
import style from './css/BoardList.module.css';

function BoardList() {
    useEffect(() => {
        getBoardList();
    }, []);

    //   const [userId, setUserId] = useState("");
    const [boards, setBoards] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState(null);

    //  ------- 게시글 list 가져오기 -------
    const getBoardList = async () => {
        try {
            const userId = sessionStorage.getItem('user_id');

            // 서버로 데이터 전송
            const response = await fetch(`${API_BASE_URL}/api/board/boardList/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                // 서버 응답이 성공인 경우
                const result = await response.json();
                // 추출된 데이터 사용
                setBoards(result);
            } else {
                console.log('문의사항 조회 실패');
                alert('오류가 발생하였습니다.');
            }
        } catch (error) {
            console.error('서버 통신 오류', error);
        }
    };

    return (
        <div className={common.background}>
            <Header sub_title="내 정보" />

            <div className={style.main_area}>
                <div className={style.title}>
                    <div>문의사항</div>
                </div>
                <div className={style.list}>
                    <div className={style.boardList_table}>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>카테고리</th>
                                    <th>제목</th>
                                </tr>
                            </thead>
                            <tbody>
                                {boards.map((board) => (
                                    <tr key={board.boardId}>
                                        <td>{board.boardId}</td>
                                        <td>{board.boardCategory}</td>
                                        <td>
                                            <NavLink to={`/boardDetail/${board.boardId}`}>{board.title}</NavLink>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Link to="/board">
                    <button className={style.writeButton}> 문의글 쓰기 </button>
                </Link>
            </div>
            <BottomNav />
        </div>
    );
}

export default BoardList;
