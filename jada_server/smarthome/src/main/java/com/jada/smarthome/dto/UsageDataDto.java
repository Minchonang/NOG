package com.jada.smarthome.dto;

import java.time.LocalDateTime;


import com.jada.smarthome.model.UsageData;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UsageDataDto {
    private int id;
    private String userId;
    private float dailyUsage;
   
    
    // Builder 패턴을 이용하여 Dto를 생성할 수 있는 생성자를 만들기
    @Builder
    public UsageDataDto(  int id,  String userId, float dailyUsage) {
        this.id = id;
        this.userId = userId;
        this.dailyUsage = dailyUsage;
     
    }


     // UsageData 형태로 만들기
     public UsageData toEntity() {
        return UsageData.builder()
            .id(id)
            .userId(userId)
            .dailyUsage(dailyUsage)
            .date(LocalDateTime.now())
            .build();
    }
    
  
}
