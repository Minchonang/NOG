package com.jada.smarthome.repository.JdbcRepository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.jada.smarthome.model.Board;
import com.jada.smarthome.model.Comment;
import com.jada.smarthome.model.User;

@Repository
public class JdbcBoardRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Board> findByBoardAll() {
      // String sql = "SELECT * FROM board";
      String sql = "SELECT b.*, c.comment_id, c.content AS comment_content FROM board b LEFT JOIN comment c ON b.board_id = c.board_id";
      return jdbcTemplate.query(sql, new BoardRowMapper());
    }
    class BoardRowMapper implements RowMapper<Board> {
      @Override
      public Board mapRow(ResultSet rs, int rowNum) throws SQLException{
        Board board = new Board();
        board.setBoardId(rs.getLong("board_id"));
        board.setBoardCategory(rs.getString("board_category"));
        board.setTitle(rs.getString("title"));
        board.setContent(rs.getString("content"));
        board.setWriteDate(rs.getObject("write_date", LocalDateTime.class));

        User writer = new User();
        if (rs.getObject("writer") != null) {
          writer.setId(rs.getString("writer"));
        }
        board.setWriter(writer);

        Comment comment = new Comment();
        if (rs.getObject("comment_id") != null) {
          comment.setCommentId(rs.getLong("comment_id"));
          comment.setContent(rs.getString("content"));
        }
        if (board.getComments() == null) {
          board.setComments(new ArrayList<>());
        }
        board.getComments().add(comment);

        return board;
      }

    }
  
}
