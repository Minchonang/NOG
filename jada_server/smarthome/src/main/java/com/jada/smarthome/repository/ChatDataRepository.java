package com.jada.smarthome.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jada.smarthome.model.ChatData;

public interface ChatDataRepository extends JpaRepository<ChatData, Integer> {
    // 추가적인 쿼리 메소드가 필요하다면 여기에 추가 가능
}
