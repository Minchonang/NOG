package com.jada.jada.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jada.jada.dto.JoinUserDto;
import com.jada.jada.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor // 생성자를 자동으로 생성
public class UserService {

  private final UserRepository userRepository;
  
    //   /**
    //  * @author Ryan
    //  * @description 유저 생성 컨트롤러
    //  *
    //  * @path /user/create
    //  *
    //  * @return User Id
    //  */
  //   public SuccessResponse onCreateUser(CreatUserDto creatUserDto){

  //     int id = creatUserDto.getId();
  //     String name = creatUserDto.getName();

  //     int userId = this.userRepository.save(id, name);

  //     return new SuccessResponse(true, userId);
  // }

  // @Transactional
  // public boolean join(JoinUserDto joinuserDto) {
  //     String rawPassword = joinuserDto.getPassword();
  //     String encPassword = BCryptPasswordEncoder.encode(rawPassword);
  //     joinuserDto.setPassword(encPassword);
  //     userRepository.save(joinuserDto.toEntity());
  //     return true;
  // }

}
