package com.jada.smarthome.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jada.smarthome.service.UserExitService;

@RestController
@RequestMapping("/api/userexit")
public class UserExitController {
  private final UserExitService userExitService;
  
  public UserExitController(UserExitService userExitService){
    this.userExitService = userExitService;
  }
  
}
