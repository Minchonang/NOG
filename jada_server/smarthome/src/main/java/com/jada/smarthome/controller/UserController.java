package com.jada.smarthome.controller;

import com.jada.smarthome.dto.JoinUserDto;
import com.jada.smarthome.dto.LoginUserDto;
import com.jada.smarthome.model.User;
import com.jada.smarthome.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/userinfo")
public class UserController {

    private final UserService userService;
    private static final String DUPLICATE_ID = "가입불가 - 중복된 아이디";

    @Autowired
	HttpSession session;


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
    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // 클라이언트의 주소로 변경
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody LoginUserDto loginUserDto) {
        System.out.println(loginUserDto);
        // 컨트롤러에서 서비스로 DTO 전달
        String loginResult = userService.loginUser(loginUserDto, session);

        // 로그인 성공 여부에 따라 응답을 다르게 설정
        if (loginResult.equals("로그인 성공")) {
            String userId = loginUserDto.getId();
        
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("userId", userId);
            // --------------지워야할 것 -----------------------------
            String user_id = (String) session.getAttribute("user_id");
            System.out.println("---------0-------session(user_id)"+user_id);

            return ResponseEntity.ok(responseMap);
            // return ResponseEntity.ok("로그인 성공, user_id: " + userId);
            // return ResponseEntity.ok("로그인 성공");
        } else if (loginResult.equals("비밀번호 불일치")) {
            return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(Collections.singletonMap("error", "해당 사용자가 존재하지 않습니다."));        } else {
                return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("error", "해당 사용자가 존재하지 않습니다."));        }
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

    // 아이디 찾기 : 이름 = 이메일 존재하는 유저 찾으면 id전달하도록 
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/find-id")
    public ResponseEntity<String> findUserId(@RequestBody Map<String, String> requestData) {
        String name = requestData.get("name");
        String email = requestData.get("email");

        // 이름과 이메일로 사용자 정보를 조회
        Optional<User> userOptional = userService.findUserByNameAndEmail(name, email);

        // 사용자 정보가 존재하면 해당 아이디 반환
        return userOptional.map(user -> ResponseEntity.ok(user.getId()))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("일치하는 사용자를 찾을 수 없습니다."));
    }

    // 비밀번호 확인(회원정보 수정용)
    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    @PostMapping("/check-password")
    public ResponseEntity<String> checkPassword(@RequestBody Map<String, String> requestData, HttpSession session) {
        String password = requestData.get("password");
        String id = requestData.get("id");
        System.out.println("--------------------id:"+id);
        System.out.println("--------------------pwd:"+password);

        // --------------지워야할 것 -----------------------------
        String user_id = (String) session.getAttribute("user_id");
        System.out.println("---------0-------session(user_id):"+user_id);

        // 서비스에서 비밀번호 확인
        boolean isPasswordMatch = userService.checkPassword(password, id, session);

        if (isPasswordMatch) {
            return ResponseEntity.ok("본인인증이 완료되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
        }
    }

}
