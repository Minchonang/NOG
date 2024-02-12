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
    private String address1;
    private String address2;
    private String address3;
    private Integer houseNum;
    private Integer role = 0; // 기본값 0 : 고객  vs 1 : 관리자
    private LocalDateTime creDateTime;
    

    // Builder 패턴을 이용하여 Dto를 생성할 수 있는 생성자를 만들기
    @Builder
    public JoinUserDto(String email, String id, String password, String name, String phone, String address1, String address2, String address3, Integer houseNum, LocalDateTime creDateTime) {
        this.email = email;
        this.id = id;
        this.password = password;
        this.name = name;
        this.phone = phone;
        this.address1 = address1;
        this.address2 = address2;
        this.address3 = address3;
        this.houseNum = houseNum;
        this.creDateTime = creDateTime; 
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
              .creDateTime(creDateTime != null ? creDateTime : LocalDateTime.now())
              .houseNum(houseNum)
              .role(role)
              .address1(address1)
              .address2(address2)
              .address3(address3)
              .build();
  }
}