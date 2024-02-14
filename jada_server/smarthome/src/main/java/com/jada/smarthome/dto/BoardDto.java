package com.jada.smarthome.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.jada.smarthome.model.Comment;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class BoardDto {
  private String userId;
  private Long boardId;
  private String boardCategory;
  private String title;
  private String content;
  private LocalDateTime writeDate;
  @JsonIgnore
  private Comment comment;

  public Comment getComment() {
    return comment;
  }

  public void setComment(Comment comment) {
      this.comment = comment;
  }
}
