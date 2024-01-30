package com.jada.smarthome.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jada.smarthome.dto.JoinUserDto;
import com.jada.smarthome.model.User;

@Repository
public interface UserRepository extends JpaRepository <User, String>{

}
