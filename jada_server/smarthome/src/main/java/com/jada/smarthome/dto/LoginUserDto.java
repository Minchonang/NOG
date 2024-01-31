package com.jada.smarthome.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginUserDto {

    private String id;
    private String password;

    public LoginUserDto(String id, String password) {
        this.id = id;
        this.password = password;
    }
}
