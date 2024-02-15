package com.jada.smarthome.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;


import lombok.Data;
import lombok.ToString;

@Entity
@Data
@ToString(exclude = "writer")
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
  
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "writer", referencedColumnName = "id")
  private User writer;

  //board랑 comment랑 양방향
  @OneToMany(mappedBy = "board", cascade = CascadeType.ALL)
  private List<Comment> comments;
}
