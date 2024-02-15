package com.jada.smarthome.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginUserDto {

    private String id;
    private String password;
    private Integer role;
    private String response;

    public LoginUserDto(String id, String password, Integer role, String response) {
        this.id = id;
        this.password = password;
        this.role = role;
        this.response = response;
    }
}
