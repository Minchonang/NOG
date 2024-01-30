package com.jada.jada.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jada.jada.model.User;

@Repository
public interface UserRepository extends JpaRepository <User, Integer>{
  
}
