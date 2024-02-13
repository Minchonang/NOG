package com.jada.smarthome.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jada.smarthome.model.Board;
import com.jada.smarthome.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository <Comment, Long>{
List<Comment> findByBoard(Board board);
}
