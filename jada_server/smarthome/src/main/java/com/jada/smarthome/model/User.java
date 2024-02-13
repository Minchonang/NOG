package com.jada.smarthome.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

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
  @Column(name = "id", nullable = false, length = 50)
  private String id;

  @Column(name = "name", nullable = false, length = 30)
  private String name;

  @Column(name = "email", nullable = false, length = 50)
  private String email;
  
  @Column(name = "password", nullable = false, length = 100)
  private String password;
  
  @Column(name = "newPassword", length = 100)
  private String newPassword;

  @Column(name = "phone", nullable = false, length = 20)
  private String phone;

  private LocalDateTime creDateTime;

  @Column(name = "houseNum", nullable = false)
  private Integer houseNum;
  
  // 0 : 고객, 1 : 관리자
  private Integer role;
  
  @Column(name = "address1", nullable = false, length = 30)
  private String address1;
  
  @Column(name = "address2", nullable = false, length = 30)
  private String address2;
  
  @Column(name = "address3", length = 150)
  private String address3;

  // homeDevice모델에서 user_home_id 필드 추가
  @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JoinColumn(name = "user_home_id")
  @JsonBackReference
  private HomeDevice homeDevice;

  // board모델에서 writer와 연관관계
  @JsonIgnore
  @OneToMany(mappedBy = "writer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<Board> boards;

}

