package com.example.collegedirectory.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.collegedirectory.entities.Enrollment;
import com.example.collegedirectory.entities.StudentProfile;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudent_UserId(Long userId);
    Enrollment findByStudent_UserIdAndCourse_Id(Long studentId, Long courseId);
    List<Enrollment> findByStudent(StudentProfile student);
    List<Enrollment> findByCourseIdIn(List<Long> courseIds);
    List<Enrollment> findByCourseId(Long courseId);
}
