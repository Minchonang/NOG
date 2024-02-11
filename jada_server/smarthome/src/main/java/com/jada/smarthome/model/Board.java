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

@Entity
@Data
public class Board implements Serializable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long boardId;
   
  @Column(name = "board_category", nullable = false, length = 50)
  private String boardCategory;
  
  @Column(name = "title", nullable = false, length = 255)
  private String title;
  
  @Column(name = "content", nullable = false, columnDefinition = "TEXT")
  private String content;
  
  private LocalDateTime writeDate;
  
  @ManyToOne
  @JoinColumn(name = "writer", referencedColumnName = "id")
  private User writer;

  //board랑 comment랑 양방향
  //   @OneToMany(mappedBy = "board")
  //  List<Comment> comments = new ArrayList<>();
}
