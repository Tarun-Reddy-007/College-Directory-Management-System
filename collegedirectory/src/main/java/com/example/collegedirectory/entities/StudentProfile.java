package com.example.collegedirectory.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "studentprofile") // Use consistent casing
public class StudentProfile {
    
    @Id
    @Column(name = "user_id") // Specify the column name
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "photo") // Specify the column name
    private String photo;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false) // Specify the column name and make it non-nullable
    private Department department;

    @Column(name = "year") // Specify the column name
    private String year;

    // Getters and Setters
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
