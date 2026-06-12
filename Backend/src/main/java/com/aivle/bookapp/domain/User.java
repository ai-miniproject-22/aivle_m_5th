package com.aivle.bookapp.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "users")
public class User {

    @Id
    @Column(name = "user_id", length = 100)
    private String id;
    private String username;
    private String email;
}