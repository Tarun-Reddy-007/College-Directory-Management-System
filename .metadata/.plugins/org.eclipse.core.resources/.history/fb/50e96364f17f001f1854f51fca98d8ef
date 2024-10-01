package com.example.collegedirectory.services;

import com.example.collegedirectory.entities.Enrollment;
import com.example.collegedirectory.repositories.EnrollmentRepository;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public void enrollStudent(Enrollment enrollment) {
        enrollmentRepository.save(enrollment);
    }
    
    public List<Enrollment> getEnrollmentsByStudentId(Long studentId) {
        return enrollmentRepository.findByStudent_UserId(studentId);
    }
    
    public void deleteEnrollmentByStudentAndCourse(Long studentId, Long courseId) {
        Enrollment enrollment = enrollmentRepository.findByStudent_UserIdAndCourse_Id(studentId, courseId);
        if (enrollment != null) {
            enrollmentRepository.delete(enrollment);
        } else {
            throw new RuntimeException("Enrollment not found for given student and course");
        }
    }
    
    public List<Long> getStudentIdsByCourseId(Long courseId) {
        // Fetch the enrollments for the provided courseId
        List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
        // List to hold student IDs
        List<Long> studentIds = new ArrayList<>();

        // Use a for-each loop to extract student IDs
        for (Enrollment enrollment : enrollments) {
            if (enrollment.getStudent() != null) {  // Ensure student is not null
                studentIds.add(enrollment.getStudent().getUserId()); // Add student ID to the list
            }
        }
        return studentIds; // Return the list of student IDs
    }
}
