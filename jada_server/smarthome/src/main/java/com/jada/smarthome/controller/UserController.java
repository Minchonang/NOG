package com.jada.smarthome.controller;

import com.jada.smarthome.dto.EditUserDto;
import com.jada.smarthome.dto.JoinUserDto;
import com.jada.smarthome.dto.LoginUserDto;
import com.jada.smarthome.dto.UserExitDto;
import com.jada.smarthome.dto.UserInfoDto;
import com.jada.smarthome.model.User;
// import com.jada.smarthome.repository.JdbcRepository.JdbcUserRepository;
import com.jada.smarthome.service.UserExitService;
import com.jada.smarthome.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;



@RestController
@RequestMapping("/api/userinfo")
public class UserController {

    
    private final UserService userService;
    private final UserExitService userExitService;
    // private final JdbcUserRepository jdbcUserRepository;

    private static final String DUPLICATE_ID = "가입불가 - 중복된 아이디";

    @Autowired
	HttpSession session;


    public UserController(UserService userService, UserExitService userExitService) {
        this.userService = userService;
        this.userExitService = userExitService;    
        // this.jdbcUserRepository = jdbcUserRepository;
    }

    // 아이디 중복 체크
    @GetMapping("/id-check")
    @ResponseBody
    public String idCheck(@RequestParam String id) {
        boolean isDuplicate = userService.isIdDuplicate(id);
        return isDuplicate ? DUPLICATE_ID : "가입가능";
    }

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<String> saveUserInfo(@RequestBody JoinUserDto joinUserDto) {
      
        // 아이디 중복 체크
        if (userService.isIdDuplicate(joinUserDto.getId())) {
            return ResponseEntity.ok(DUPLICATE_ID);
        }

        // 가입 가능한 경우,비밀번호 암호화 및 회원가입 진행
        userService.saveUser(joinUserDto);

        // System.out.println("================="+ joinUserDto);

        return ResponseEntity.ok("User information saved successfully");
    }

    // 로그인
    // @CrossOrigin(origins = "http://192.168.0.70:3000")
    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // 클라이언트의 주소로 변경
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody LoginUserDto loginUserDto) {
        
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

    // 로그아웃
    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // 클라이언트의 주소로 변경
    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(@RequestBody String userid, HttpServletResponse response) {
        // System.out.println(session.getAttribute(userid));
        session.invalidate();

        // 세션 쿠키 제거
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);

        return ResponseEntity.ok("로그아웃 성공");
    }
    
    

    // 유저 정보 조회 (전체 조회)
    @GetMapping("/get")
    public ResponseEntity<List<JoinUserDto>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<JoinUserDto> joinUserDtos = new ArrayList<>();

        for (User user : users) {
            Integer homeId = null;
            String serialNum = null;
            if (user.getHomeDevice() != null) {
                homeId = user.getHomeDevice().getHomeId();
                serialNum = user.getHomeDevice().getSerialNum();
            }
            JoinUserDto joinUserDto = JoinUserDto.builder()
                    .email(user.getEmail())
                    .id(user.getId())
                    .name(user.getName())
                    .phone(user.getPhone())
                    .address1(user.getAddress1())
                    .address2(user.getAddress2())
                    .address3(user.getAddress3())
                    .houseNum(user.getHouseNum())
                    .creDateTime(user.getCreDateTime())
                    .homeId(homeId)
                    .serialNum(serialNum)
                    .build();

            joinUserDtos.add(joinUserDto);
        }

        return ResponseEntity.ok(joinUserDtos);
    }

    // 유저 정보 전체 조회(jdbc)
    // @GetMapping("/allusers")
    // public List<User> allUsers() {
    //     return jdbcUserRepository.findAll();
    // }

    

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


        // 서비스에서 비밀번호 확인
        boolean isPasswordMatch = userService.checkPassword(password, id, session);

        if (isPasswordMatch) {
            return ResponseEntity.ok("본인인증이 완료되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
        }
    }

    // 비밀번호 찾기 : 아이디 = 이메일 존재하는 유저 찾으면 새 비밀번호로 초기화
     @CrossOrigin(origins = "http://localhost:3000")
     @PostMapping("/find-pwd")
     public ResponseEntity<String> findUserPwd(@RequestBody Map<String, String> requestData) {
         String id = requestData.get("id");
         String email = requestData.get("email");
 
         // 아이디과 이메일로 사용자 정보를 조회
         Optional<User> userOptional = userService.findUserByIdAndEmail(id, email);
 
         // 사용자 정보가 존재하면 해당 아이디 반환
         return userOptional.map(user -> ResponseEntity.ok("본인인증 되었습니다."))
                 .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("일치하는 사용자를 찾을 수 없습니다."));
     }

    
     @CrossOrigin(origins = "http://localhost:3000")
     @PostMapping("/pwdforget")
     @ResponseBody
     public String pwdforgetPost(@RequestBody User user) {
         return userService.changePassword(user);
     }

    // 회원정보 조회
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/userfind")
    public ResponseEntity<?> getUserInfo(@RequestBody  Map<String, String> requestData) {
        String id = requestData.get("user_id");

        // userId를 기반으로 회원 정보를 조회
        UserInfoDto userInfo = userService.getUserInfo(id);

        if (userInfo != null) {

            return ResponseEntity.ok(userInfo);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
        }
    }


    // 회원정보 수정
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/edituser")
    public ResponseEntity<String> editUser(@RequestBody EditUserDto editUserDto){
        try {
            String user_id = editUserDto.getUser_id();
            String newEmail = editUserDto.getEmail();
            String newPhone = editUserDto.getPhone();
            String newPassword = editUserDto.getPassword();
            String newAddress1 = editUserDto.getAddress1();
            String newAddress2 = editUserDto.getAddress2();
            String newAddress3 = editUserDto.getAddress3();
            Integer newHouseNum = editUserDto.getHouseNum();
    
            String result = userService.editUser(user_id, newEmail, newPhone, newPassword, newHouseNum,newAddress1,newAddress2,newAddress3);
            System.out.println("============수정된값:"+result);
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("서버오류가 발생했습니다.");
        }

    }

    // 회원탈퇴
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/userdelete")
    public ResponseEntity<?> exitAccount(@RequestBody  Map<String, String> requestData) {
        // 세션에서 현재 사용자 정보 가져오기
        // User currentUser = (User) session.getAttribute("user_info");
        // System.out.println("-------------------"+currentUser);
        String id = requestData.get("user_id");
        System.out.println("----------------------------------------"+ id);


        // if (id == null) {
        //     // 세션이 유효하지 않으면 로그인 페이지로 리다이렉트
        //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("세션이 유효하지 않습니다.");
        // }

        try {
            // 회원 정보 삭제
            userService.userdelete(id);
            // 로그아웃 등의 추가 작업이 필요하다면 여기에 추가할 수 있습니다.
            session.invalidate(); // 세션 무효화

            return ResponseEntity.ok("회원탈퇴가 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원탈퇴 중 오류가 발생했습니다.");
        }

    }

    // 전체 회원 수 조회
    @GetMapping("/count")
    public ResponseEntity<Long> getUserCount() {
        Long userCount = userService.getUserCount(); // userService에서 전체 회원 수 조회하는 메서드 호출
        return ResponseEntity.ok(userCount);
    }

    // 회원 역할 조회
    @PostMapping("/getRole")
    public ResponseEntity<?> getUserRole(@RequestBody String userId){
        
        UserInfoDto result = userService.getUserRole(userId);

        try {
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 역할 조회 중 오류가 발생했습니다.");
        }
    }

        // 관리자 회원정보 수정
        @CrossOrigin(origins = "http://localhost:3000")
        @PostMapping("/admineditUser")
        public ResponseEntity<String> admineditUser(@RequestBody EditUserDto editUserDto){
            try {
                String user_id = editUserDto.getUser_id();
                String newName= editUserDto.getName();
                String newEmail = editUserDto.getEmail();
                String newPhone = editUserDto.getPhone();
                String newAddress1 = editUserDto.getAddress1();
                String newAddress2 = editUserDto.getAddress2();
         
        
                String result = userService.admineditUser(user_id,newName, newEmail, newPhone,newAddress1,newAddress2);
                System.out.println("============수정된값:"+result);
                return ResponseEntity.ok(result);
                
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("서버오류가 발생했습니다.");
            }
    
        }
    
}

