package com.example.collegedirectory.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "studentprofile") 
public class StudentProfile {
    
    @Id
    @Column(name = "user_id") 
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "photo") 
    private String photo;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false) 
    private Department department;

    @Column(name = "year") 
    private String year;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }
}
