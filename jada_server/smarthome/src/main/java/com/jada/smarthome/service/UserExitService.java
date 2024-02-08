package com.jada.smarthome.service;

import org.springframework.stereotype.Service;

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
  
}
