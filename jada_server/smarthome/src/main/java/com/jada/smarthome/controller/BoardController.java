package com.jada.smarthome.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jada.smarthome.dto.BoardDto;
import com.jada.smarthome.dto.JoinUserDto;
import com.jada.smarthome.model.Board;
import com.jada.smarthome.service.BoardService;

@RestController
@RequestMapping("/api/board")
public class BoardController {
  private final BoardService boardService;

  public BoardController(BoardService boardService){
    this.boardService = boardService;
  }

  // 문의사항 작성
  @PostMapping("/write")
  public ResponseEntity<Map<String, Object>> saveBoard(@RequestBody BoardDto boardDto){
   String result = boardService.saveBoard(boardDto); 
   
    if (result != null) {
        return ResponseEntity.ok(Collections.singletonMap("message" ,result));
    } else {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error","저장에 실패했습니다."));
    }
  }

  // 문의사항 리스트 조회
  @GetMapping("/boardList")
  public ResponseEntity<List<BoardDto>> getBoardList(){
    List<Board> boards = boardService.getBoardList();
    List<BoardDto> boardListDtos = boards.stream()
                                  .map(board -> BoardDto.builder()
                                    .userId(board.getWriter().getId())
                                    .boardId(board.getBoardId())
                                    .boardCategory(board.getBoardCategory())
                                    .title(board.getTitle())
                                    .content(board.getContent())
                                    .writeDate(board.getWriteDate())
                                    .build())
                                  .collect(Collectors.toList());


    return ResponseEntity.ok(boardListDtos);
  }
  
}
