package com.jada.smarthome.controller;

import com.jada.smarthome.dto.JoinUserDto;
import com.jada.smarthome.model.User;
import com.jada.smarthome.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/userinfo")
public class UserController {

    private final UserService userService;
    private static final String DUPLICATE_ID = "가입불가 - 중복된 아이디";


    public UserController(UserService userService) {
        this.userService = userService;        
    }

    // 아이디 중복 체크
    @GetMapping("/id-check")
    @ResponseBody
    public String idCheck(@RequestParam String id) {
        boolean isDuplicate = userService.isIdDuplicate(id);
        return isDuplicate ? DUPLICATE_ID : "가입가능";
    }

    // 유저정보저장
    @PostMapping("/join")
    public ResponseEntity<String> saveUserInfo(@RequestBody JoinUserDto joinUserDto) {
      
        // 아이디 중복 체크
        if (userService.isIdDuplicate(joinUserDto.getId())) {
            return ResponseEntity.ok(DUPLICATE_ID);
        }

        // 가입 가능한 경우,비밀번호 암호화 및 회원가입 진행
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
