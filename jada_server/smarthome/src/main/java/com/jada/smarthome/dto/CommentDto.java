package com.jada.smarthome.dto;

import com.jada.smarthome.model.Board;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommentDto {
  private String userId;
  private Long commentId;
  private String content;
  private Board board;
}
