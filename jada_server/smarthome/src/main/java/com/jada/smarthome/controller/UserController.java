package com.jada.smarthome.controller;

import com.jada.smarthome.dto.JoinUserDto;
import com.jada.smarthome.dto.LoginUserDto;
import com.jada.smarthome.model.User;
import com.jada.smarthome.service.UserService;

import org.springframework.http.HttpStatus;
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

    // 유저정보저장(회원가입)
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

    // 로그인
    // @CrossOrigin(origins = "http://192.168.0.70:3000")
    @CrossOrigin(origins = "http://localhost:3000") // 클라이언트의 주소로 변경
    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody LoginUserDto loginUserDto) {
        System.out.println(loginUserDto);
        // 컨트롤러에서 서비스로 DTO 전달
        String loginResult = userService.loginUser(loginUserDto);

        // 로그인 성공 여부에 따라 응답을 다르게 설정
        if (loginResult.equals("로그인 성공")) {
            return ResponseEntity.ok("로그인 성공");
        } else if (loginResult.equals("비밀번호 불일치")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 일치하지 않습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("해당 사용자가 존재하지 않습니다.");
        }
    }

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
