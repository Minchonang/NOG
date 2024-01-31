package com.jada.smarthome.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jada.smarthome.dto.JoinUserDto;
import com.jada.smarthome.dto.LoginUserDto;
import com.jada.smarthome.model.User;
import com.jada.smarthome.repository.UserRepository;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
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
    public String loginUser(LoginUserDto loginUserDto) {
        // LoginUserDto에서 id와 password를 추출
        String id = loginUserDto.getId();
        String password = loginUserDto.getPassword();

        // UserRepository를 이용하여 id에 해당하는 사용자 정보를 조회
        Optional<User> userOptional = userRepository.findById(id);

        // 사용자 정보가 존재하면서 비밀번호가 일치하는지 확인
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
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
}