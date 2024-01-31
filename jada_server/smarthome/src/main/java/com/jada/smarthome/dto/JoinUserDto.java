package com.jada.smarthome.dto;


import java.time.LocalDateTime;


import com.jada.smarthome.model.User;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class JoinUserDto {
    private String email;
    private String id;
    private String password;
    private String name;
    private String phone;
    private String address;
    private Integer houseNum;
    private Integer role = 0; // 기본값 0 : 고객  vs 1 : 관리자
    

    // Builder 패턴을 이용하여 Dto를 생성할 수 있는 생성자를 만들기
    @Builder
    public JoinUserDto(String email, String id, String password, String name, String phone, String address, Integer houseNum) {
        this.email = email;
        this.id = id;
        this.password = password;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.houseNum = houseNum;
    }
    // id 중복체크
    private boolean idDuplicateCheck;

    // user 데이터 형태로 만들기
    public User toEntity(){
      return User.builder()
              .email(email)
              .id(id)
              .password(password)
              .name(name)
              .phone(phone)
              .creDateTime(LocalDateTime.now())
              .houseNum(houseNum)
              .role(role)
              .address(address)
              .build();
    }
  }

  

