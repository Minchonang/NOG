package com.jada.jada.dto;

import com.jada.jada.model.User;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class JoinUserDto {
  private String name;
  private String email;
  private String password;
  private String phone;
  private Integer houseNum;
  private Integer houseSquare;
  private String address;

  // Builder 패턴을 이용하여 Dto를 생성할 수 있는 생성자를 만들기
  @Builder
  public JoinUserDto(String name, String email, String password, String phone, Integer houseNum, Integer houseSquare, String address){
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.houseNum = houseNum;
    this.houseSquare = houseSquare;
    this.address = address;
  }
  // DB에 삽입할 Entity 객체를 만들어 리턴해주는 toEntity 메서드
//   public User toEntity(){
//     return User.builder()
//             .name(name)
//             .password(password)
//             .email(email)
//             .phone(phone)
//             .houseNum(houseNum)
//             .houseSquare(houseSquare)
//             .address(address)
//             .build();
// }
  
}
