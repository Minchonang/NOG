package com.jada.smarthome.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jada.smarthome.dto.BoardDto;
import com.jada.smarthome.dto.CommentDto;
import com.jada.smarthome.model.Board;
import com.jada.smarthome.model.Comment;
import com.jada.smarthome.model.User;
import com.jada.smarthome.repository.BoardRepository;
import com.jada.smarthome.repository.CommentRepository;
import com.jada.smarthome.repository.UserRepository;

@Service
public class BoardService {
  private final BoardRepository boardRepository;
  private final UserRepository userRepository;
  private final CommentRepository commentRepository;

  public BoardService(BoardRepository boardRepository, UserRepository userRepository, CommentRepository commentRepository){
    this.boardRepository = boardRepository;
    this.userRepository = userRepository;
    this.commentRepository = commentRepository;
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
  
    // 문의사항 유저정보 조회
    public List<Board> getBoardListByUserId(String userId) {
      return boardRepository.findByWriterId(userId);
  }

  // 문의사항 상세정보 조회
    public Optional<Board> getBoardById(Long boardId) {
      Optional<Board> boardOptional = boardRepository.findByBoardId(boardId);
      return boardOptional;
  }

  // 댓글 저장
  public List<Comment> saveComment(CommentDto commentDto){
    String userId = commentDto.getUserId();
    String content = commentDto.getContent();
    if (commentDto.getBoardId() == null) {
      throw new IllegalArgumentException("게시물 정보가 올바르지 않습니다.");
    }
    Long boardId = commentDto.getBoardId();

    Comment comment = new Comment();
    comment.setContent(content);
    comment.setWriteDate(LocalDateTime.now());
    comment.setBoard(boardRepository.findById(boardId)
                                     .orElseThrow(() -> new RuntimeException("게시물을 찾을 수 없습니다.")));
    comment.setWriter(userId);
    commentRepository.save(comment);

    // 댓글 리스트 전달
    List<Comment> comments = commentRepository.findByBoard(boardRepository.findById(boardId).orElse(null));
    System.out.println(comments);
    return comments;
  }

  // 댓글 조회
  public List<CommentDto> commentInfo(CommentDto commentDto){
    Long boardId = commentDto.getBoardId();
    // 댓글 리스트 전달
    List<Comment> comments = commentRepository.findByBoard(boardRepository.findById(boardId).orElse(null));

    List<CommentDto> commentDtos = new ArrayList<>();

    for (Comment comment : comments) {
        CommentDto dto = CommentDto.builder()
            .commentId(comment.getCommentId())
            .content(comment.getContent())
            .build();
        commentDtos.add(dto);
    }
    return commentDtos;
  }
}
