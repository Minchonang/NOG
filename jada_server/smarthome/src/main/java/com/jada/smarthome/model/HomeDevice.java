package com.jada.smarthome.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

@Entity
@Data
public class HomeDevice implements Serializable {
    @Id
    @Column(name = "home_id", nullable = false, length = 50)
    private String homeId;

    @Column(name = "lastest_time")
    private LocalDateTime lastestTime;

    @Column(name = "device", length = 100)
    private String device;

    @Column(name = "airconditioner", columnDefinition = "BOOL DEFAULT false")
    private Boolean airconditioner;

    @Column(name = "heater", columnDefinition = "BOOL DEFAULT false")
    private Boolean heater;

    @Column(name = "light", columnDefinition = "BOOL DEFAULT false")
    private Boolean light;

    @Column(name = "temperature_now")
    private Integer temperatureNow;

    @Column(name = "human_count")
    private Integer humanCount;

    @Column(name = "set_boiler_temp")
    private Integer setBoilerTemp;

    @Column(name = "set_air_temp")
    private Integer setAirTemp;
    
    // User와의 연관관계 설정
    // @OneToMany(mappedBy = "homeDevice", fetch = FetchType.EAGER)
    // @JsonIgnore
    // private List<User> users;
  
}
