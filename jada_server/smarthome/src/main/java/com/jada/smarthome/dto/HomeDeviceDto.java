package com.jada.smarthome.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class HomeDeviceDto {
  private String userId;
  // private String homeId;
  // private Boolean heater;
  // private Boolean airconditioner;
  // private Integer setBoilerTemp;
  // private Integer setAirTemp;
  private Integer humanCount;
}
