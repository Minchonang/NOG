package com.jada.smarthome.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.jada.smarthome.dto.HomeDeviceDto;
import com.jada.smarthome.dto.UserExitDto;
import com.jada.smarthome.model.User;
import com.jada.smarthome.model.UserExit;
import com.jada.smarthome.repository.UserExitRepository;
import com.jada.smarthome.repository.UserRepository;

@Service
public class UserExitService {
  
  private final UserExitRepository userExitRepository;
  private final UserRepository userRepository;

  public UserExitService(UserExitRepository userExitRepository, UserRepository userRepository){
    this.userExitRepository = userExitRepository;
    this.userRepository = userRepository;
  }
  // 회원탈퇴 사유 저장
   public boolean setExitContent(UserExitDto userExitDto){
    String userId = userExitDto.getUserId();

     if (userId != null){
       Optional<User> optionalUser= userRepository.findById(userId);

       if (optionalUser.isPresent()) {
       System.out.println("=========optionalUser========="+optionalUser);
        //  주소
       String userAddress = optionalUser.get().getAddress1();
        //  탈퇴사유
       String exitContent = userExitDto.getExitContent();
        //  탈퇴날짜
        LocalDateTime exitDate = LocalDateTime.now();

        UserExit userExit = new UserExit();
        userExit.setExitContent(exitContent);
        userExit.setExitDate(exitDate);
        userExit.setUserAddress(userAddress);
        // 탈퇴사유 저장
        userExitRepository.save(userExit);
        // 회원정보 삭제
        userRepository.deleteById(userId);
       return true;
       } else {
        return false;
       }
      }else{
        return false;
      }

   }

 
}
