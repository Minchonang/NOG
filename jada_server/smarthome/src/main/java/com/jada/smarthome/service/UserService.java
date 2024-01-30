package com.jada.smarthome.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jada.smarthome.dto.JoinUserDto;
import com.jada.smarthome.model.User;
import com.jada.smarthome.repository.UserRepository;


@Service
public class UserService {

    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void saveUser(JoinUserDto joinUserDto) {
        // JoinUserDto를 User 엔터티로 변환 후 저장
        User user = joinUserDto.toEntity();
        userRepository.save(user);
    }

    public List<User> getAllUsers() {
        // 데이터베이스에서 모든 유저 정보를 조회
        return userRepository.findAll();
    }

}
