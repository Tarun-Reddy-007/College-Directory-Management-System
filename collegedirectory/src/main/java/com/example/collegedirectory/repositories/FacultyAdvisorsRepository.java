package com.example.collegedirectory.repositories;

import com.example.collegedirectory.entities.FacultyAdvisors;
import com.example.collegedirectory.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacultyAdvisorsRepository extends JpaRepository<FacultyAdvisors, Long> {
    FacultyAdvisors findByStudent(User student);
}
