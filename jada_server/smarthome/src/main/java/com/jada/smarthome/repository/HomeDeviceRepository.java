package com.jada.smarthome.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jada.smarthome.model.HomeDevice;

@Repository
public interface HomeDeviceRepository extends JpaRepository <HomeDevice, String>{
  // HomeDevice 엔터티에서 users 필드를 통해 user_home_id로 HomeDevice를 찾기
  List<HomeDevice> findByHomeId(String homeId);
  List<HomeDevice> findBySerialNum(String serialNum);

}
