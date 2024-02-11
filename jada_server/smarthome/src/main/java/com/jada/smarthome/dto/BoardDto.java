package com.jada.smarthome.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BoardDto {
  private String userId;
  private Long boardId;
  private String boardCategory;
  private String title;
  private String content;
  private LocalDateTime writeDate;
}
