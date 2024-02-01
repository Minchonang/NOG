package com.jada.smarthome.service;

import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    // JoinUserDto를 User 엔터티로 변환 후 저장
    public void saveUser(JoinUserDto joinUserDto) {
        // 비밀번호 암호화
        String rawPassword = joinUserDto.getPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);
        joinUserDto.setPassword(encodedPassword);
        
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

    // 로그인 기능
    public String loginUser(LoginUserDto loginUserDto,HttpSession session) {
        // LoginUserDto에서 id와 password를 추출
        String id = loginUserDto.getId();
        String password = loginUserDto.getPassword();

        // UserRepository를 이용하여 id에 해당하는 사용자 정보를 조회
        Optional<User> userOptional = userRepository.findById(id);

        // 사용자 정보가 존재하면서 비밀번호가 일치하는지 확인
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                // 로그인 성공 시 세션에 id 저장
                session.setAttribute("user_id", user.getId());
                
                return "로그인 성공";
            } else {
                return "비밀번호 불일치";
            }
        } else {
            return "해당 사용자가 존재하지 않습니다.";
        }
    }

    // 이름과 이메일로 사용자 정보를 조회하는 메서드
    public Optional<User> findUserByNameAndEmail(String name, String email) {
        return userRepository.findByNameAndEmail(name, email);
    }

    // 세션에서 현재 로그인된 사용자의 비밀번호 확인
    public boolean checkPassword(String password, String id, HttpSession session) {
        // UserRepository를 이용하여 현재 로그인된 사용자의 정보 조회
        Optional<User> userOptional = userRepository.findById(id);
        System.out.println(userOptional);
        String enrollpwd = userOptional.get().getPassword();
        System.out.println(enrollpwd);

        // 세션
        // System.out.println("----------1------"+session);
        // String user_id = (String) session.getAttribute("user_id");
        // System.out.println("---------591264-------"+user_id);
        // if (!id.equals(user_id)) {
        //     return false;
        // }


        // 사용자 정보가 존재하면서 비밀번호가 일치하는지 확인
        // return DBUser != null && passwordEncoder.matches(password, DBUser.getPassword());
        if(passwordEncoder.matches(password, enrollpwd)){
            return true;
        }else{
            return false;
        }     
        //  return userOptional.map(dbUser -> passwordEncoder.matches(password, dbUser.getPassword()))
        // .orElse(false);
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
    public String editUser(EditUserDto editUserDto){
       Optional<User> userOptional = userRepository.findById(editUserDto.getUser_id());
       System.out.println("user레파지토리 정보 :"+ userOptional);

       if (userOptional.isPresent()) {
        User user = userOptional.get();
        editUserDto.setId(user.getId());
        editUserDto.setName(user.getName());
        editUserDto.setEmail(user.getEmail());
        editUserDto.setPhone(user.getPhone());
        editUserDto.setAddress(user.getAddress());
        editUserDto.setHouseNum(user.getHouseNum());
        
        System.out.println("사용자 정보 조회 완료");
        } else {
        System.out.println("사용자 정보가 존재하지 않습니다.");
        }

        return editUserDto.toString();
    }

    // 회원정보 조회
    public UserInfoDto getUserInfo(String userId) {
    Optional<User> userOptional = userRepository.findById(userId);
    System.out.println("user레파지토리 정보 :"+ userOptional);
    
    if (userOptional.isPresent()) {
    User user = userOptional.get();
    UserInfoDto userInfoDto = new UserInfoDto();
    userInfoDto.setUserId(userId);
    userInfoDto.setName(user.getName()); 
    userInfoDto.setEmail(user.getEmail());
    userInfoDto.setPhone(user.getPhone());
    userInfoDto.setAddress1(user.getAddress1());
    userInfoDto.setAddress2(user.getAddress2());
    userInfoDto.setAddress3(user.getAddress3());
    userInfoDto.setHouseNum(user.getHouseNum());
        
    }

    return userInfoDto;
}

}
