package com.jada.smarthome.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jada.smarthome.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository <Comment, Long>{
  
}
