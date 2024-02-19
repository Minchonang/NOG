import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../App.js';

import Header from '../common/jsx/Header';
import common from '../common/css/common.module.css';
import style from './css/Inquiry.module.css';

function Inquiry() {
   const [boards, setBoards] = useState([]);
   const [selectedBoard, setSelectedBoard] = useState(null);

   useEffect(() => {
      getBoardList();
   }, []);

   //  ------- 게시글 list 가져오기 -------
   const getBoardList = async () => {
      try {
         // 서버로 데이터 전송 - 경로 수정 필요
         const response = await fetch(`${API_BASE_URL}/api/board/allboards`, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
         });
         if (response.ok) {
            // // 서버 응답이 성공인 경우
            const result = await response.json();
            console.log(result);
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

   //  ------- 게시글 상세정보 -------
   const handleBoardClick = (board) => {
      setSelectedBoard(board);
   };

   // 모달 창 닫기
   const handleCloseModal = () => {
      setSelectedBoard(null);
   };

   const goDetail = (boardId) => {
      window.open(`/boardDetail/${boardId}`);
      handleCloseModal();
   };

   // 댓글이 하나 이상 있는지 확인
   const hasCommentId = (board) => {
      return board.comments.some((comment) => comment.commentId);
   };

   return (
      <>
         <div className={common.background}>
            <Header sub_title="관리자" />
            <div className={style.main_area}>
               <div className={style.title}>
                  <div>문의사항</div>
               </div>
               <div className={style.list}>
                  <div className={style.boardList_table}>
                     <table>
                        <tbody>
                           <tr className={style.userList_title}>
                              <td>No.</td>
                              <td>카테고리</td>
                              <td>제목</td>
                           </tr>
                           {boards.map((board) => (
                              <tr key={board.boardId} onClick={() => handleBoardClick(board)}>
                                 <td>{board.boardId}</td>
                                 <td>{board.boardCategory}</td>
                                 <td style={{ color: hasCommentId(board) ? 'orange' : 'black' }}>
                                    {board.title.length > 11 ? `${board.title.substring(0, 11)}...` : board.title}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
               {selectedBoard && (
                  <div className={style.custom_modal}>
                     <div className={style.close} onClick={handleCloseModal}>
                        &times;
                     </div>
                     <div className={style.modal_container}>
                        {/* <hr className={style.bookends} /> */}
                        <div className={style.modal_title}>{selectedBoard.boardId}번 문의사항</div>
                        <div className={style.modal_content}>
                           <p>회원: {selectedBoard.writer.id}</p>
                           <p>카테고리: {selectedBoard.boardCategory}</p>
                           <p>
                              제목:{' '}
                              {selectedBoard.title.length > 12
                                 ? `${selectedBoard.title.substring(0, 12)}...`
                                 : selectedBoard.title}
                           </p>
                           <p>
                              내용:{' '}
                              {selectedBoard.content.length > 12
                                 ? `${selectedBoard.content.substring(0, 12)}...`
                                 : selectedBoard.content}
                           </p>
                           <p>작성일자: {new Date(selectedBoard.writeDate).toLocaleString('ko-KR')}</p>
                        </div>
                        <div className={style.btn_area}>
                           <button className={style.reply_btn} onClick={() => goDetail(selectedBoard.boardId)}>
                              답변하기
                           </button>
                           {/* <button
										className={style.close_btn}
										onClick={handleCloseModal}
									>
										닫기
									</button> */}
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </>
   );
}

export default Inquiry;
