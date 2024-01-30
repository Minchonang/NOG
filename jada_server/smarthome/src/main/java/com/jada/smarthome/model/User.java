package com.jada.smarthome.model;

import java.io.Serializable;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.Builder;
import lombok.Data;

@Entity
@Data
@Builder
public class User implements Serializable {

  @Id
  private String id;

  @Column(name = "name", nullable = false, length = 30)
  private String name;

  @Column(name = "email", nullable = false, length = 100)
  private String email;

  @Column(name = "password", nullable = false, length = 50)
  private String password;

  @Column(name = "phone", nullable = false, length = 20)
  private String phone;

  private Date creDateTime;

  @Column(name = "houseNum", nullable = false)
  private Integer houseNum;

  // @Column(name = "houseSquare", nullable = false)
  // private Integer houseSquare;

  @Column(name = "role", nullable = false)
  // 0 : 고객, 1 : 관리자
  private Integer role = 0;

  @Column(name = "address", nullable = false, length = 255)
  private String address;
}
