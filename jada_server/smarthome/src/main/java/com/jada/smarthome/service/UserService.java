package com.jada.smarthome.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import com.jada.smarthome.dto.EditUserDto;
import com.jada.smarthome.dto.JoinUserDto;
import com.jada.smarthome.dto.LoginUserDto;
import com.jada.smarthome.dto.UserInfoDto;
import com.jada.smarthome.model.User;
import com.jada.smarthome.repository.UserRepository;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
   HttpSession session;
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 회원가입
    public void saveUser(JoinUserDto joinUserDto) {
        // 비밀번호 암호화
        String rawPassword = joinUserDto.getPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);
        joinUserDto.setPassword(encodedPassword);
        
        // JoinUserDto를 User 엔터티로 변환 후 저장
        User user = joinUserDto.toEntity();
        userRepository.save(user);
    }

    //모든 유저 정보를 조회
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();

        return users;
    }

    // id 중복체크
    public boolean isIdDuplicate(String id) {
        User user = userRepository.findById(id).orElse(null);

        return user != null;
    }

    // 로그인
    public LoginUserDto loginUser(LoginUserDto loginUserDto,HttpSession session) {

        String id = loginUserDto.getId();
        String password = loginUserDto.getPassword();


        Optional<User> userOptional = userRepository.findById(id);


        // 사용자 정보가 존재하면서 비밀번호가 일치하는지 확인
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Integer userRole = user.getRole();
            

            if (passwordEncoder.matches(password, user.getPassword())) {
                // 로그인 성공 시 세션에 id 저장
                session.setAttribute("user_id", user.getId());
                loginUserDto.setRole(userRole);
                loginUserDto.setResponse("로그인 성공");
                loginUserDto.setPassword(null);
                return loginUserDto;
            } else {
                loginUserDto.setResponse("비밀번호 불일치");
                loginUserDto.setPassword(null);
                return loginUserDto;
            }
        } else {
            loginUserDto.setResponse("해당 사용자가 존재하지 않습니다.");
            loginUserDto.setPassword(null);
            return loginUserDto;
        }
    }

    // 이름과 이메일로 사용자 정보를 조회하는 메서드
    public Optional<User> findUserByNameAndEmail(String name, String email) {
        return userRepository.findByNameAndEmail(name, email);
    }

    // 세션에서 현재 로그인된 사용자의 비밀번호 확인
    public boolean checkPassword(String password, String id, HttpSession session) {
        Optional<User> userOptional = userRepository.findById(id);
        String enrollpwd = userOptional.get().getPassword();

        if(passwordEncoder.matches(password, enrollpwd)){
            return true;
        }else{
            return false;
        }     
     
    }
    
    // 아이디과 이메일로 사용자 정보를 조회하는 메서드
    public Optional<User> findUserByIdAndEmail(String id, String email) {
        return userRepository.findByIdAndEmail(id, email);
    }

    // 비밀번호 초기화하는 메서드
    public String changePassword(User user) {
        try {
            String newPassword = user.getNewPassword();
            if (newPassword != null && !newPassword.isEmpty()) {
                String hashedPassword = passwordEncoder.encode(newPassword);
                User existingUser = userRepository.findById(user.getId()).orElse(null);
                if (existingUser != null) {
                    existingUser.setPassword(hashedPassword);
                    userRepository.save(existingUser);
                    return "비밀번호가 성공적으로 변경되었습니다.";
                } else {
                    return "해당 사용자를 찾을 수 없습니다.";
                }
            } else {
                return "비밀번호 값을 올바르게 입력하십시오.";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "비밀번호 변경 중 오류가 발생하였습니다. 오류 내용: " + e.getMessage();
        }
    }

    // 회원정보 수정
    public String editUser(String user_id, String newEmail, String newPhone, String newPwd, Integer newhouserNum, String newAddress1, String newAddress2, String newAddress3){
    
       Optional<User> userOptional = userRepository.findById(user_id);

       if (userOptional.isPresent()) {
        User user = userOptional.get();

        user.setEmail(newEmail);
        user.setPhone(newPhone);
        if (newPwd != null) {
            String enPassword = passwordEncoder.encode(newPwd);
            user.setPassword(enPassword);
        }
        user.setAddress1(newAddress1);
        user.setAddress2(newAddress2);
        user.setAddress3(newAddress3);
        user.setHouseNum(newhouserNum);
        
        // 저장된 값을 다시 userRepository를 통해 저장
        userRepository.save(user);
        return "수정이 완료되었습니다.";
        } 

        return "사용자 정보가 존재하지 않습니다.";
    }

    // 회원정보 조회
    public UserInfoDto getUserInfo(String user_id) {
        Optional<User> userOptional = userRepository.findById(user_id);
        
        if (userOptional.isPresent()) {
        User user = userOptional.get();
        UserInfoDto userInfoDto = new UserInfoDto();
        userInfoDto.setUserId(user.getId());
        userInfoDto.setName(user.getName()); 
        userInfoDto.setEmail(user.getEmail());
        userInfoDto.setPhone(user.getPhone());
        userInfoDto.setAddress1(user.getAddress1());
        userInfoDto.setAddress2(user.getAddress2());
        userInfoDto.setAddress3(user.getAddress3());
        userInfoDto.setHouseNum(user.getHouseNum());
        userInfoDto.setHomeDevice(user.getHomeDevice());
        userInfoDto.setRole(user.getRole());

            return userInfoDto;
        }else{
            return null;
        }
        }

    // 회원정보 삭제
    public void userdelete(String id) {
        userRepository.deleteById(id);
    }

    // 전체 회원 수 조회 메서드
    public Long getUserCount() {
        return userRepository.count();
    }

    // 회원역할 조회
    public UserInfoDto getUserRole(String userId){
       Optional<User> users = userRepository.findById(userId);
       Integer userRole = users.get().getRole();

       if(users.isPresent()) {
            UserInfoDto userInfoDto = new UserInfoDto();
            userInfoDto.setRole(userRole);
            return userInfoDto;
        } else {
            return null;
        }
    }

      // 관리자 회원정보 수정
      public String admineditUser(String user_id, String newName, String newEmail, String newPhone, String newAddress1, String newAddress2){
    
        Optional<User> userOptional = userRepository.findById(user_id);
 
        if (userOptional.isPresent()) {
         User user = userOptional.get();
         user.setName(newName);
         user.setEmail(newEmail);
         user.setPhone(newPhone);
         user.setAddress1(newAddress1);
         user.setAddress2(newAddress2);
         
         // 저장된 값을 다시 userRepository를 통해 저장
         userRepository.save(user);
         return "수정이 완료되었습니다.";
         } 
 
         return "사용자 정보가 존재하지 않습니다.";
     }
}