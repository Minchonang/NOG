package com.jada.smarthome.service;

import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.EntityNotFoundException;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jada.smarthome.dto.BoardDto;
import com.jada.smarthome.model.Board;
import com.jada.smarthome.model.User;
import com.jada.smarthome.repository.BoardRepository;
import com.jada.smarthome.repository.UserRepository;

@Service
public class BoardService {
  private final BoardRepository boardRepository;
  private final UserRepository userRepository;

  public BoardService(BoardRepository boardRepository, UserRepository userRepository){
    this.boardRepository = boardRepository;
    this.userRepository = userRepository;
  }

  // 문의사항 저장
  public String saveBoard(BoardDto boardDto){
    String userId = boardDto.getUserId();
    String boardCategory = boardDto.getBoardCategory();
    String title = boardDto.getTitle();
    String content = boardDto.getContent();

    // 사용자 ID를 이용하여 사용자 객체 조회
    User user = userRepository.findById(userId)
                              .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    Board board = new Board();
    board.setWriter(user);
    board.setBoardCategory(boardCategory);
    board.setTitle(title);
    board.setContent(content);
    board.setWriteDate(LocalDateTime.now());
    
    boardRepository.save(board);

    return "문의사항 접수가 완료되었습니다.";

  }

  // 문의사항 리스트 조회
    public List<Board> getBoardList() {
        return boardRepository.findAll();
    }
  
    public List<Board> getBoardListByUserId(String userId) {
      return boardRepository.findByWriterId(userId);
  }
}
