// package com.jada.smarthome.repository.JdbcRepository;

// import java.sql.ResultSet;
// import java.sql.SQLException;
// import java.util.ArrayList;
// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.jdbc.core.RowMapper;
// import org.springframework.stereotype.Repository;

// import com.jada.smarthome.dto.BoardDto;
// import com.jada.smarthome.model.Board;
// import com.jada.smarthome.model.Comment;
// import com.jada.smarthome.model.HomeDevice;
// import com.jada.smarthome.model.User;
// import com.jada.smarthome.repository.JdbcRepository.JdbcUserRepository.UserRowMapper;

// @Repository
// public class JdbcBoardRepository {
//     @Autowired
//     private JdbcTemplate jdbcTemplate;

//       class BoardRowMapper implements RowMapper<BoardDto> {
//         @Override
//         public BoardDto mapRow(ResultSet rs, int rowNum) throws SQLException {
//             BoardDto boardDto = new BoardDto();
//             boardDto.setBoardId(rs.getLong("board_id"));
//             boardDto.setBoardCategory(rs.getString("board_category"));
//             boardDto.setTitle(rs.getString("title"));
//             boardDto.setContent(rs.getString("content"));
//             boardDto.setWriteDate(rs.getTimestamp("write_date").toLocalDateTime());
//             boardDto.setUserId(rs.getString("writer"));

            
//             List<Comment> comments = new ArrayList<>();

//             if (rs.getLong("comment_id") != 0) {
//               do {
//                   // Create a new comment object
//                   Comment comment = new Comment();
//                   comment.setCommentId(rs.getLong("comment_id"));
//                   comment.setCommentContent(rs.getString("comment_content"));
//                   comment.setCommentDate(rs.getTimestamp("comment_date").toLocalDateTime());
//                   // Add the comment to the list
//                   comments.add(comment);
//               } while (rs.next() && rs.getLong("board_id") == boardDto.getBoardId());
//               // Since we moved the result set to the next row, we need to move it back
//               rs.previous();
//           }
//           // Set the list of comments for the board
//           boardDto.setComments(comments);

//             return boardDto;
//           }
//         }
//       }
     
//       public List<Board> findByUserId() {
//         String sql = "SELECT b.*, c.* FROM board b LEFT JOIN comment c ON b.board_id = c.board_id WHERE b.writer = ?";
//       // String sql = "SELECT * FROM user";
//       return jdbcTemplate.query(sql, new BoardRowMapper());
//       }

// }
