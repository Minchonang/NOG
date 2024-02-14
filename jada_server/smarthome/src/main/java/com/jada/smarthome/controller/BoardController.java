package com.jada.smarthome.controller;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jada.smarthome.dto.BoardDto;
import com.jada.smarthome.dto.CommentDto;
import com.jada.smarthome.model.Board;
import com.jada.smarthome.model.Comment;
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
  
  // 특정 사용자의 문의사항 리스트 조회
  @GetMapping("/boardList/{userId}")
  public ResponseEntity<List<BoardDto>> getUserBoardList(@PathVariable String userId) {
      try {
          List<Board> boards = boardService.getBoardListByUserId(userId);
          System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ boards : " + boards);
          List<BoardDto> boardListDtos = boards.stream()
          .map(board -> {
            BoardDto boardDto = BoardDto.builder()
                .userId(board.getWriter().getId())
                .boardId(board.getBoardId())
                .boardCategory(board.getBoardCategory())
                .title(board.getTitle())
                .content(board.getContent())
                .writeDate(board.getWriteDate())
                .comment(board.getComments().isEmpty() ? null : board.getComments().get(0) )
                .build();
            
            // Comment 정보를 설정
            if (!board.getComments().isEmpty()) {
                Comment comment = board.getComments().get(0);
                boardDto.setComment(comment);
              }
              return boardDto;
          })
          .collect(Collectors.toList());
                  System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ boardListDtos : " + boardListDtos);

         return ResponseEntity.ok(boardListDtos);
      } catch (Exception e) {
          // 예외 처리
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
      }
    }

     // 특정 게시글의 상세 정보 조회
     @GetMapping("/boardDetail")
     public ResponseEntity<?> getBoardDetail(@RequestParam(name = "boardId", defaultValue = "1") Long boardId) {

        try {
            Optional<Board> boardOptional = boardService.getBoardById(boardId);
             System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ boardOptional : "+boardOptional);
            
             if (boardOptional.isPresent()) {
                 Board board = boardOptional.get();
                 System.out.println("------------------------------------------------- board : " + board);
                 BoardDto boardDto = BoardDto.builder()
                 .userId(board.getWriter().getId())
                 .boardId(board.getBoardId())
                 .boardCategory(board.getBoardCategory())
                 .title(board.getTitle())
                 .content(board.getContent())
                 .writeDate(board.getWriteDate())
                 .comment(board.getComments().isEmpty() ? null : board.getComments().get(0))
                 .build();
                 System.out.println("------------------------------------------------- boardDto : " + boardDto);

                 return ResponseEntity.ok(boardDto);
             } else {
                 return ResponseEntity.notFound().build();
             }
         } catch (EntityNotFoundException e) {
             // 해당 게시글이 없는 경우
             return ResponseEntity.notFound().build();
         } catch (Exception e) {
             // 기타 예외 처리
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
         }
     }

  // 댓글 저장
  @PostMapping("/getComment")
  public ResponseEntity<List<?>> saveComment(@RequestBody CommentDto commentDto){
    List<Comment> result = boardService.saveComment(commentDto); 
   
    if (result != null) {
        return ResponseEntity.ok(result);
    } else {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonList("저장에 실패했습니다."));
    }
  }

  // 댓글 정보 조회
  @PostMapping("/commentInfo")
  public ResponseEntity <List<CommentDto>> commentInfo(@RequestBody CommentDto commentDto){
    List<CommentDto>  result =  boardService.commentInfo(commentDto);
    if (result != null) {
      return ResponseEntity.ok(result);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

}
