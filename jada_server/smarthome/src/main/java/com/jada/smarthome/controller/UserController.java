package com.jada.smarthome.controller;

import com.jada.smarthome.dto.JoinUserDto;
import com.jada.smarthome.model.User;
import com.jada.smarthome.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/userinfo")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 유저정보저장
    @PostMapping("/join")
    public ResponseEntity<String> saveUserInfo(@RequestBody JoinUserDto joinUserDto) {
      
        userService.saveUser(joinUserDto);

        System.out.println("=================");
        System.out.println(joinUserDto);

        return ResponseEntity.ok("User information saved successfully");
    }

    // 유저 정보 조회 (예시: 전체 조회)
    // @GetMapping("/get")
    // public List<JoinUserDto> getAllUsers() {
      
    //     return userService.getAllUsers();
    // }
    // 유저 정보 조회 (예시: 전체 조회)
    @GetMapping("/get")
    public ResponseEntity<List<JoinUserDto>> getAllUsers() {
    List<User> users = userService.getAllUsers();
    List<JoinUserDto> joinUserDtos = users.stream()
            .map(user -> JoinUserDto.builder()
                    .email(user.getEmail())
                    .id(user.getId())
                    // 비밀번호 제외
                    // .password(user.getPassword())
                    .name(user.getName())
                    .phone(user.getPhone())
                    .address(user.getAddress())
                    .houseNum(user.getHouseNum())
                    .build())
            .collect(Collectors.toList());

    return ResponseEntity.ok(joinUserDtos);
}
    
}
