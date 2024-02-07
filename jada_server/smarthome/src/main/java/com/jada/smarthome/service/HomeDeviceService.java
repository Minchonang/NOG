package com.jada.smarthome.service;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.jada.smarthome.dto.HomeDeviceDto;
import com.jada.smarthome.model.HomeDevice;
import com.jada.smarthome.model.User;
import com.jada.smarthome.repository.HomeDeviceRepository;
import com.jada.smarthome.repository.UserRepository;

@Service
public class HomeDeviceService {

  private final UserRepository userRepository;
  private final HomeDeviceRepository homeDeviceRepository;
  
  
  public HomeDeviceService(UserRepository userRepository, HomeDeviceRepository homeDeviceRepository) {
      this.userRepository = userRepository;
      this.homeDeviceRepository = homeDeviceRepository;
    }
    
  // 홈 디바이스 정보 조회 및 변경
  public ResponseEntity<HomeDeviceDto> getHomeDevice(HomeDeviceDto homeDeviceDto){
    String userId = homeDeviceDto.getUserId();

    if (userId != null){
      Optional<User> optionalUser = userRepository.findById(userId);
      if(optionalUser.isPresent()){
        User foundUser = optionalUser.get();
        HomeDevice homeDevice = foundUser.getHomeDevice();
        
       
        if(homeDevice != null){
          HomeDeviceDto resultDto = HomeDeviceDto.builder()
          .light(homeDevice.getLight())
          .heater(homeDevice.getHeater())
          .airconditioner(homeDevice.getAirconditioner())
          .temperatureNow(homeDevice.getTemperatureNow())
          .setBoilerTemp(homeDevice.getSetBoilerTemp())
          .setAirTemp(homeDevice.getSetAirTemp())
          .humanCount(homeDevice.getHumanCount())
          .build();
          
          return ResponseEntity.ok(resultDto);
        } else {
          return ResponseEntity.status(HttpStatus.NOT_FOUND).body(HomeDeviceDto.builder().errorMessage("homedevice 정보를 찾을 수 없습니다.").build());
        }
      } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(HomeDeviceDto.builder().errorMessage("유저정보를 찾을 수 없습니다.").build());
        }
    }else{
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(HomeDeviceDto.builder().errorMessage("로그인 하십시오.").build());
    }
  }

  // 전등 온오프 수정
  public String editLight(HomeDeviceDto homeDeviceDto, Boolean setLight) {
    String userId = homeDeviceDto.getUserId();

    if (userId != null) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User foundUser = optionalUser.get();
            HomeDevice homeDevice = foundUser.getHomeDevice();

            if (homeDevice != null) {
                // 여기서 setLight를 사용하여 homeDevice의 light 속성을 변경
                homeDevice.setLight(setLight);

                homeDeviceRepository.save(homeDevice);
                return "수정이 완료되었습니다.";
            } else {
                return "homedevice 정보를 찾을 수 없습니다.";
            }
        } else {
            return "유저정보를 찾을 수 없습니다.";
        }
    } else {
        return "로그인 하십시오.";
    }
  }

  
  // 에어컨 온오프 수정
  public String editAir(HomeDeviceDto homeDeviceDto, Boolean setAir) {
    String userId = homeDeviceDto.getUserId();

    if (userId != null) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User foundUser = optionalUser.get();
            HomeDevice homeDevice = foundUser.getHomeDevice();

            if (homeDevice != null) {
              
                homeDevice.setAirconditioner(setAir);

                homeDeviceRepository.save(homeDevice);
                return "수정이 완료되었습니다.";
            } else {
                return "homedevice 정보를 찾을 수 없습니다.";
            }
        } else {
            return "유저정보를 찾을 수 없습니다.";
        }
    } else {
        return "로그인 하십시오.";
    }
  }

  // 보일러 온오프 수정
  public String editBoiler(HomeDeviceDto homeDeviceDto, Boolean setBoiler) {
    String userId = homeDeviceDto.getUserId();

    if (userId != null) {
        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isPresent()) {
            User foundUser = optionalUser.get();
            HomeDevice homeDevice = foundUser.getHomeDevice();

            if (homeDevice != null) {
           
                homeDevice.setHeater(setBoiler);

                homeDeviceRepository.save(homeDevice);
                return "수정이 완료되었습니다.";
            } else {
                return "homedevice 정보를 찾을 수 없습니다.";
            }
        } else {
            return "유저정보를 찾을 수 없습니다.";
        }
    } else {
        return "로그인 하십시오.";
    }
  }
}