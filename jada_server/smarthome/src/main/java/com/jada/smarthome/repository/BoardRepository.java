package com.jada.smarthome.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jada.smarthome.model.Board;
import com.jada.smarthome.model.User;

@Repository
public interface BoardRepository extends JpaRepository <Board, Long>{
    List<Board> findByWriterId(String userId);
}
