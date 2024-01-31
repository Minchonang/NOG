package com.jada.smarthome.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jada.smarthome.model.User;
import java.util.Optional;
import java.util.List;



@Repository
public interface UserRepository extends JpaRepository <User, String>{
  Optional<User> findById(String id);
  Optional<User> findByNameAndEmail(String name, String email);
  Optional<User> findByIdAndEmail(String id, String email);
}
