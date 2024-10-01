package com.example.collegedirectory.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.collegedirectory.entities.StudentProfile;
import com.example.collegedirectory.entities.User;

import org.springframework.stereotype.Repository;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    StudentProfile findByUserId(Long userId);
    StudentProfile findByUser(User user);
    @Query("SELECT sp.department.name, COUNT(sp) FROM StudentProfile sp GROUP BY sp.department.name")
    List<Object[]> countStudentsByDepartment();
}
