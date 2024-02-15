// import org.springframework.jdbc.core.RowMapper;

// import com.jada.smarthome.dto.JoinUserDto;

// import java.sql.ResultSet;
// import java.sql.SQLException;

// public class JoinUserDtoRowMapper implements RowMapper<JoinUserDto> {
//     @Override
//     public JoinUserDto mapRow(ResultSet rs, int rowNum) throws SQLException {
//         JoinUserDto joinUserDto = JoinUserDto.builder()
//                 .email(rs.getString("email"))
//                 .id(rs.getString("id"))
//                 .name(rs.getString("name"))
//                 .phone(rs.getString("phone"))
//                 .address1(rs.getString("address1"))
//                 .address2(rs.getString("address2"))
//                 .address3(rs.getString("address3"))
//                 .houseNum(rs.getInt("houseNum"))
//                 .creDateTime(rs.getTimestamp("creDateTime").toLocalDateTime())
//                 .homeId(rs.getObject("homeId", Integer.class)) // homeId가 null일 수 있으므로 getObject를 사용하여 Integer로 가져옵니다.
//                 .serialNum(rs.getString("serialNum"))
//                 .build();
//         return joinUserDto;
//     }
// }
