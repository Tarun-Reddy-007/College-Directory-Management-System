package com.example.collegedirectory.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "facultyprofile")
public class FacultyProfile {
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

    private String OfficeHours;

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

    public String getOfficeHours() {
        return OfficeHours;
    }

    public void setOfficeHours(String officeHours) {
        this.OfficeHours = officeHours;
    }
}
