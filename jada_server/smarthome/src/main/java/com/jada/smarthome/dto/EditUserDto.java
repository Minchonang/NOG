package com.jada.smarthome.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EditUserDto {
  private String user_id;
  private String email;
  private String phone;
  private String password;
  // private String address1;
  // private String address2;
  // private String address3;
  private Integer houseNum;
}