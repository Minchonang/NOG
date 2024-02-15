package com.jada.smarthome.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jada.smarthome.dto.UserExitDto;
import com.jada.smarthome.service.UserExitService;

@RestController
@RequestMapping("/api/userexit")
public class UserExitController {
  private final UserExitService userExitService;
  
  public UserExitController(UserExitService userExitService){
    this.userExitService = userExitService;
  }
  
  @CrossOrigin(origins = "http://54.180.132.149:3000")
  @PostMapping("/userdelete")
  public ResponseEntity<String> userExit(@RequestBody UserExitDto userExitDto){
    boolean result = userExitService.setExitContent(userExitDto);
    if (result) {
        return ResponseEntity.ok("회원탈퇴가 완료되었습니다.");
    } else {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("회원탈퇴 중 오류가 발생했습니다.");
    }
  }
}
