package com.jada.smarthome.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jada.smarthome.dto.JoinUserDto;
import com.jada.smarthome.model.User;
import com.jada.smarthome.repository.UserRepository;


@Service
public class UserService {

    private final UserRepository userRepository;
    // private final PasswordEncoder passwordEncoder;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        // this.passwordEncoder = passwordEncoder;
    }

    // JoinUserDto를 User 엔터티로 변환 후 저장
    public void saveUser(JoinUserDto joinUserDto) {
        // // 비밀번호 암호화
        // String rawPassword = joinUserDto.getPassword();
        // String encodedPassword = passwordEncoder.encode(rawPassword);
        // joinUserDto.setPassword(encodedPassword);
        
        User user = joinUserDto.toEntity();
        userRepository.save(user);

    }

    // 데이터베이스에서 모든 유저 정보를 조회
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // id 중복체크
    public boolean isIdDuplicate(String id) {
        User user = userRepository.findById(id).orElse(null);
        return user != null;
    }

}
