package com.jada.jada.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jada.jada.service.UserService;

import lombok.RequiredArgsConstructor;

@RequestMapping("/api/userinfo")
@RequiredArgsConstructor // 생성자를 자동으로 생성
@RestController
public class UserController {

  private final UserService userService;

  // 유저정보 받아오기
  // @GetMapping("")
  // public List<JoinUserDto.> (
  //         @RequestParam(name = "id") String id,
  //         @RequestParam(name = "email") String email,
  //         @RequestParam(name = "password") String password,
  //         @RequestParam(name = "phone") String phone,
  //         @RequestParam(name = "houseNum") Integer houseNum) {

  //     return userService.(id, email, password, phone, houseNum);
  // }
  
}
