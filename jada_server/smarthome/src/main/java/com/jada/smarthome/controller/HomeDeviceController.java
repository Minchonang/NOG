package com.jada.smarthome.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jada.smarthome.dto.EditUserDto;
import com.jada.smarthome.dto.HomeDeviceDto;
import com.jada.smarthome.model.HomeDevice;
import com.jada.smarthome.model.User;
import com.jada.smarthome.repository.HomeDeviceRepository;
import com.jada.smarthome.repository.UserRepository;
import com.jada.smarthome.service.HomeDeviceService;

@RestController
@RequestMapping("/api/homedevice")
public class HomeDeviceController {
  @Autowired
  private HomeDeviceService homeDeviceService;

  @Autowired
  UserRepository userRepository;

  // 홈 디바이스 정보 조회
  // @CrossOrigin(origins = "http://localhost:3000")
  @PostMapping("/")
  public ResponseEntity<HomeDeviceDto> homedevice(@RequestBody HomeDeviceDto homeDeviceDto){

    return homeDeviceService.getHomeDevice(homeDeviceDto);
  }

  // 전등 온오프 수정
  // @CrossOrigin(origins = "http://localhost:3000")
  @PostMapping("/editLight")
  public ResponseEntity<String> editLight(@RequestBody HomeDeviceDto homeDeviceDto){
      try {
  
        Boolean setLight = homeDeviceDto.getLight();
  
        String result = homeDeviceService.editLight(homeDeviceDto, setLight);
      
        return ResponseEntity.ok(result);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("서버오류가 발생했습니다.");
      }
  }

 // 에어컨 온오프 수정
  // @CrossOrigin(origins = "http://localhost:3000")
  @PostMapping("/editAir")
  public ResponseEntity<String> editAir(@RequestBody HomeDeviceDto homeDeviceDto){
     try {
 
       Boolean setAir = homeDeviceDto.getAirconditioner();
 
       String result = homeDeviceService.editAir(homeDeviceDto, setAir);

       return ResponseEntity.ok(result);
     } catch (Exception e) {
         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("서버오류가 발생했습니다.");
     }

 
}

 // 보일러 온오프 수정
  // @CrossOrigin(origins = "http://localhost:3000")
  @PostMapping("/editBoiler")
  public ResponseEntity<String> editBoiler(@RequestBody HomeDeviceDto homeDeviceDto){
     try {
 
       Boolean setBoiler = homeDeviceDto.getHeater();
 
       String result = homeDeviceService.editBoiler(homeDeviceDto, setBoiler);
     
       return ResponseEntity.ok(result);
     } catch (Exception e) {
         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("서버오류가 발생했습니다.");
     }
}
 
  // 온도 수정
  // @CrossOrigin(origins = "http://localhost:3000")
  @PostMapping("/editTemp")
  public ResponseEntity<String> editTemp(@RequestBody HomeDeviceDto homeDeviceDto){
      try {
  
        String result = homeDeviceService.editTemp(homeDeviceDto);
      
        return ResponseEntity.ok(result);
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("서버오류가 발생했습니다.");
      }
  }

  // 시리얼 넘버 조회
  // @CrossOrigin(origins = "http://localhost:3000")
  @PostMapping("/serialCheck")
  public ResponseEntity<Map<String, String>> serialCheck(@RequestBody Map<String, String> serialCheck){
      try {
          String userId = serialCheck.get("userId");
          String serialNum = serialCheck.get("serialNum");

          String result = homeDeviceService.serialCheck(userId, serialNum);
          System.out.println("===================result :" + result);

          Map<String, String> body = new HashMap<>();
        body.put("message", result);

          return ResponseEntity.ok(body);
          
      } catch (Exception e) {
        Map<String, String> errorBody = new HashMap<>();
        errorBody.put("error", "시리얼 번호 변경에 실패하였습니다.");
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorBody);
      }
  }

}
