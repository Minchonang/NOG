package com.jada.smarthome.controller;

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

  @PostMapping("/")
  public ResponseEntity<HomeDeviceDto> homedevice(@RequestBody HomeDeviceDto homeDeviceDto){

    return homeDeviceService.getHomeDevice(homeDeviceDto);
 
  }

}
