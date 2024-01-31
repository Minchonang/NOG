package com.jada.smarthome.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jada.smarthome.model.User;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository <User, String>{
  Optional<User> findById(String id);
}
