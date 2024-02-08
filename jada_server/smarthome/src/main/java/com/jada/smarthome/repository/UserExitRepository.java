package com.jada.smarthome.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jada.smarthome.model.UserExit;

@Repository
public interface UserExitRepository extends JpaRepository <UserExit, Integer>{
  
}
