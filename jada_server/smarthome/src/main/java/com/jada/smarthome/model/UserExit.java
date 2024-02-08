package com.jada.smarthome.model;

import java.io.Serializable;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;


@Entity
@Data
public class UserExit  implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

  @Column(name = "exitDate")
  private LocalDateTime exitDate;

  @Column(name = "exitContent", nullable = false)
  private String exitContent;

  @Column(name = "userAddress", length = 30)
  private String userAddress;

  
}
