package com.example.collegedirectory.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.collegedirectory.entities.FacultyProfile;
import com.example.collegedirectory.entities.User;

import org.springframework.stereotype.Repository;

@Repository
public interface FacultyProfileRepository extends JpaRepository<FacultyProfile, Long> {
    FacultyProfile findByUserId(Long userId);
    FacultyProfile findByUser(User user);
    
}
