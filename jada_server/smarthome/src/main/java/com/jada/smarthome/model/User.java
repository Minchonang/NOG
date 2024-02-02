package com.jada.smarthome.model;

import java.io.Serializable;
import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements Serializable {

  @Id
  @Column(name = "id", nullable = false, length = 255)
  private String id;

  @Column(name = "name", nullable = false, length = 30)
  private String name;

  @Column(name = "email", nullable = false, length = 100)
  private String email;

  @Column(name = "password", nullable = false, length = 100)
  private String password;

  // @Column(name = "newpassword", length = 100)
  // private String newpassword;

  @Column(name = "phone", nullable = false, length = 20)
  private String phone;

  private LocalDateTime creDateTime;

  @Column(name = "houseNum", nullable = false)
  private Integer houseNum;

  // @Column(name = "houseSquare", nullable = false)
  // private Integer houseSquare;

  // 0 : 고객, 1 : 관리자
  private Integer role;

  private String newPassword;
	
  @Column(name = "address1", nullable = false, length = 255)
  private String address1;
  
  @Column(name = "address2", nullable = false, length = 255)
  private String address2;
  
  @Column(name = "address3", length = 255)
  private String address3;
}

