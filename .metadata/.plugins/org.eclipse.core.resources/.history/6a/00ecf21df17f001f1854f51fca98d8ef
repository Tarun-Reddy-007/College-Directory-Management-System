package com.example.collegedirectory.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.collegedirectory.entities.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {
    // Custom method to fetch course directly without using Optional
    Course findById(long id);
    List<Course> findByFacultyId(Long facultyId);
}

