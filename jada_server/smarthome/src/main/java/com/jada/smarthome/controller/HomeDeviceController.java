package com.jada.smarthome.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jada.smarthome.dto.HomeDeviceDto;
import com.jada.smarthome.model.HomeDevice;
import com.jada.smarthome.model.User;
import com.jada.smarthome.repository.HomeDeviceRepository;
import com.jada.smarthome.repository.UserRepository;

@RestController
@RequestMapping("/api/homedevice")
public class HomeDeviceController {
  @Autowired
  UserRepository userRepository;

  @Autowired
  HomeDeviceRepository homeDeviceRepository;

  // 현재 집안에 있는 사람 수
  @PostMapping("/")
  public ResponseEntity<String> homedevice(@RequestBody HomeDeviceDto homeDeviceDto){
    String user_id = homeDeviceDto.getUserId();
    System.out.println("----------------------------------------"+ user_id);

    if (user_id == null) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User ID cannot be null");
    }

    Optional<User> optionalUser = userRepository.findById(user_id);
    
    if (optionalUser.isPresent()) {
      User foundUser = optionalUser.get();
      HomeDevice homeDevice = foundUser.getHomeDevice();

      if (homeDevice != null) {
        String userHomeId = homeDevice.getHomeId();
        System.out.println("=====User Home ID: " + userHomeId);

        // on/off버튼 조회
        Boolean curlight = homeDevice.getLight();
        System.out.println("=====User Home light: " + curlight);
        Boolean curheater = homeDevice.getHeater();
        System.out.println("=====User Home Heater: " + curheater);
        Boolean curaircon = homeDevice.getAirconditioner();
        System.out.println("=====User Home Airconditioner: " + curaircon);

        // 현재 실내 온도
        Integer curtemp = homeDevice.getTemperatureNow();
        System.out.println("=====User Home 실내온도: " + curtemp);

        // 설정 온도
        Integer setBoilerTemp = homeDevice.getSetBoilerTemp();
        System.out.println("=====User Home 보일러 설정온도: " + setBoilerTemp);
        Integer setAirTemp = homeDevice.getSetAirTemp();
        System.out.println("=====User Home 에어컨 설정온도: " + setAirTemp);

        // 현재 가구원 수
        Integer human_count = foundUser.getHomeDevice().getHumanCount();
         // Integer를 String으로 변환
        String humanCountString = String.valueOf(human_count);
        System.out.println("=========human_count: " + humanCountString);
        
        // return "User Home ID: " + userHomeId;
        return ResponseEntity.ok(humanCountString);
      } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("HomeDevice not found for the user");
      }
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + user_id);
    }

  }
  // @PostMapping("/")
  // public ResponseEntity<String> homedevice(@RequestBody Map<String, String> requestData){
  //   String user_id = requestData.get("user_id");
  //   System.out.println("----------------------------------------"+ user_id);
  //   Optional<User> optionalUser = userRepository.findById(user_id);
    
  //   if (optionalUser.isPresent()) {
  //     User foundUser = optionalUser.get();

  //     HomeDevice homeDevice = foundUser.getHomeDevice();

  //     if (homeDevice != null) {
  //       String userHomeId = homeDevice.getHomeId();
  //       System.out.println("=====User Home ID: " + userHomeId);

  //       String device = homeDevice.getDevice();
  //       System.out.println("=====User Home Device: " + device);

  //       Integer human_count = foundUser.getHomeDevice().getHumanCount();
  //       System.out.println("=========human_count :" + human_count);

  //       // Integer를 String으로 변환
  //       String humanCountString = String.valueOf(human_count);
  //       System.out.println("=========human_count as String :" + humanCountString);
        
  //       // return "User Home ID: " + userHomeId;
  //       return ResponseEntity.ok(humanCountString);
  //     } else {
  //       return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
  //     }
  //   } else {
  //     return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
  //   }

  // }
  
}
