package com.jada.smarthome.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jada.smarthome.model.Board;

@Repository
public interface BoardRepository extends JpaRepository <Board, Long>{
    List<Board> findByWriterId(String userId);
    Optional<Board> findByBoardId(Long boardId);
}
