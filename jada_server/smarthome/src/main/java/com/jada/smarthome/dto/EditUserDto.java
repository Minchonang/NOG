package com.jada.smarthome.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EditUserDto {
  private String user_id;
  private String id;
  private String name;
  private String email;
  private String phone;
  private String address;
  private Integer houseNum;
  
}