package com.jada.smarthome.model;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Data
@Table(name = "chat_data")
public class ChatData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_index")
    private int chatIndex;

    @Column(name = "chat_time", nullable = false)
    private LocalDateTime chatTime;

    @Column(name = "chat_user_id", nullable = false)
    private String chatUserId;

    @Column(name = "data_question", nullable = false, columnDefinition = "LONGTEXT")
    private String dataQuestion;

    @Column(name = "user_question", nullable = false, columnDefinition = "LONGTEXT")
    private String userQuestion;

    @Column(name = "similar")
    private Float similar;
}
