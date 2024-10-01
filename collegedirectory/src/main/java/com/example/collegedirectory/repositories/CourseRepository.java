package com.example.collegedirectory.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.collegedirectory.entities.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Course findById(long id);
    List<Course> findByFacultyId(Long facultyId);
}

