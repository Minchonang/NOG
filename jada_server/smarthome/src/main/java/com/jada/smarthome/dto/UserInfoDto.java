package com.jada.smarthome.dto;

import com.jada.smarthome.model.HomeDevice;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserInfoDto {
    private String userId;
    private String name;
    private String email;
    private String phone;
    private String address1;
    private String address2;
    private String address3;
    private Integer houseNum;
    private HomeDevice homeDevice;
    private Integer role;
}
