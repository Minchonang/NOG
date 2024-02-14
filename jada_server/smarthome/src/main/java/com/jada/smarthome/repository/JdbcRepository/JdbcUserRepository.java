// package com.jada.smarthome.repository.JdbcRepository;

// import java.sql.ResultSet;
// import java.sql.SQLException;
// import java.util.List;
// import java.util.Map;

// import javax.sql.DataSource;


// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.jdbc.core.RowMapper;
// import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
// import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
// import org.springframework.jdbc.core.namedparam.SqlParameterSource;
// import org.springframework.stereotype.Repository;

// import java.time.LocalDateTime;

// import com.jada.smarthome.dto.JoinUserDto;
// import com.jada.smarthome.model.User;

// @Repository
// public class JdbcUserRepository {
//     @Autowired
//     private JdbcTemplate jdbcTemplate;

//     class UserRowMapper implements RowMapper<User> {
//         @Override
//         public User mapRow(ResultSet rs, int rowNum) throws SQLException {
//             User user = new User();
//             user.setId(rs.getString("id"));
//             user.setName(rs.getString("name"));
//             user.setEmail(rs.getString("email"));
//             user.setPassword(rs.getString("password"));
//             user.setPhone(rs.getString("phone"));
//             user.setCreDateTime(rs.getTimestamp("creDateTime").toLocalDateTime());
//             user.setHouseNum(rs.getInt("houseNum"));
//             user.setRole(rs.getInt("role"));
//             user.setAddress1(rs.getString("address1"));
//             user.setAddress2(rs.getString("address2"));
//             user.setAddress3(rs.getString("address3"));
//             // HomeDevice와 Board 필드는 여기서 처리해주시면 됩니다.
//             return user;
//         }
//     }

//     public List<User> findAll() {
//         String sql = "SELECT * FROM User";
//         return jdbcTemplate.query(sql, new UserRowMapper());
//     }
// }
  

