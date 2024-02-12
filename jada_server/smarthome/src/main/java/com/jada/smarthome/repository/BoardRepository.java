package com.jada.smarthome.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jada.smarthome.model.Board;

@Repository
public interface BoardRepository extends JpaRepository <Board, Long>{
  
}
