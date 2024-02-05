package com.jada.smarthome.dto;

import lombok.Builder;
import lombok.Data;

@Data
public class HomeDeviceDto {
  // error메시지
  private String errorMessage;

  private String userId;
  private Boolean light;
  private Boolean heater;
  private Boolean airconditioner;
  private Integer temperatureNow;
  private Integer setBoilerTemp;
  private Integer setAirTemp;
  private Integer humanCount;

  @Builder
  public HomeDeviceDto(Boolean light, Boolean heater, Boolean airconditioner,
  Integer temperatureNow, Integer setBoilerTemp, Integer setAirTemp, Integer humanCount, String errorMessage) {
  this.light = light;
  this.heater = heater;
  this.airconditioner = airconditioner;
  this.temperatureNow = temperatureNow;
  this.setBoilerTemp = setBoilerTemp;
  this.setAirTemp = setAirTemp;
  this.humanCount = humanCount;
  this.errorMessage = errorMessage;
  }

}

