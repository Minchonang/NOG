package com.jada.smarthome.repository.JdbcRepository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import org.springframework.stereotype.Repository;

import com.jada.smarthome.model.HomeDevice;
import com.jada.smarthome.model.User;

@Repository
public class JdbcUserRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    class UserRowMapper implements RowMapper<User> {
        @Override
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            User user = new User();
            user.setId(rs.getString("id"));
            user.setName(rs.getString("name"));
            user.setEmail(rs.getString("email"));
            user.setPassword(rs.getString("password"));
            user.setPhone(rs.getString("phone"));
            user.setCreDateTime(rs.getTimestamp("cre_date_time").toLocalDateTime());
            user.setHouseNum(rs.getInt("house_num"));
            user.setRole(rs.getInt("role"));
            user.setAddress1(rs.getString("address1"));
            user.setAddress2(rs.getString("address2"));
            user.setAddress3(rs.getString("address3"));
            
            if (rs.getObject("user_home_id") != null) {
            HomeDevice homeDevice = new HomeDevice();
            homeDevice.setHomeId(rs.getInt("user_home_id"));
            user.setHomeDevice(homeDevice);
        }

            return user;
        }
    }

    public List<User> findAll() {
        String sql ="SELECT u.*, hd.* FROM user u LEFT JOIN home_device hd ON u.user_home_id = hd.home_id;";
        // String sql = "SELECT * FROM user";
        return jdbcTemplate.query(sql, new UserRowMapper());
    }
}
  

