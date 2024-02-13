package com.jada.smarthome.model;

import java.io.Serializable;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Data;
import lombok.ToString;

@Entity
@Data
@ToString(exclude = "board")
public class Comment implements Serializable{
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long commentId;

  @Column(name = "content", nullable = false, columnDefinition = "TEXT")
  private String content;

  private String writer;

  //작성일자
  LocalDateTime writeDate;

  @ManyToOne
  @JoinColumn(name = "board_id")
  private Board board;
  
}
