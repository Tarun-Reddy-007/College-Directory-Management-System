package com.example.collegedirectory.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "administratorprofile")
public class AdministratorProfile {
    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String photo;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;
}
