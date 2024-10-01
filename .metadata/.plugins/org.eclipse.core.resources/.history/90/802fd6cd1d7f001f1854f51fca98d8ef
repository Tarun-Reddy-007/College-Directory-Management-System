package com.example.collegedirectory.controllers;

import com.example.collegedirectory.entities.Course;
import com.example.collegedirectory.entities.Enrollment;
import com.example.collegedirectory.entities.StudentProfile;
import com.example.collegedirectory.services.CourseService;
import com.example.collegedirectory.services.EnrollmentService;
import com.example.collegedirectory.services.StudentProfileService;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;
    
    @Autowired
    private StudentProfileService studentProfileService;// Ensure this is an instance variable

    @Autowired
    private CourseService courseService;
    
    @PostMapping("/enroll")
    public ResponseEntity<String> enrollStudent(@RequestBody Enrollment enrollment) {
        System.out.println("Received enrollment request: " + enrollment);
        
        try {
            
            // Ensure student and course are not null
            if (enrollment.getStudent() == null || enrollment.getCourse() == null) {
                return ResponseEntity.badRequest().body("Student and Course must not be null.");
            }
            
            if (enrollment.getStudent().getUserId() == null) {
                return ResponseEntity.badRequest().body("Student ID must not be null.");
            }
            
            if (enrollment.getCourse().getId() == null) {
                return ResponseEntity.badRequest().body("Course ID must not be null.");
            }
            
            // Fetch the StudentProfile and Course from the database using their IDs
            StudentProfile student = studentProfileService.findById(enrollment.getStudent().getUserId());
            Course course = courseService.findById(enrollment.getCourse().getId());

            // Check if the student and course exist
            if (student == null) {
                return ResponseEntity.badRequest().body("Student does not exist.");
            }
            
            if (course == null) {
                return ResponseEntity.badRequest().body("Course does not exist.");
            }

            // Set the fetched student and course to enrollment
            enrollment.setStudent(student);
            enrollment.setCourse(course);

            // Save the enrollment
            enrollmentService.enrollStudent(enrollment);
            return ResponseEntity.ok("Enrollment successful");
        } catch (Exception e) {
            System.err.println("Error occurred: " + e.getMessage());
            e.printStackTrace(); // Print the stack trace for more context
            return ResponseEntity.status(500).body("Enrollment failed: " + e.getMessage());
        }
    }
    
    @GetMapping("/getstudentcourses/{studentId}")
    public ResponseEntity<List<Course>> getEnrolledCourses(@PathVariable Long studentId) {
        try {
            List<Enrollment> enrollments = enrollmentService.getEnrollmentsByStudentId(studentId);
            if (enrollments.isEmpty()) {
                return ResponseEntity.notFound().build(); // No enrollments found
            }
            
            // Extract courses from enrollments
            List<Course> courses = enrollments.stream()
                    .map(Enrollment::getCourse)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            System.err.println("Error occurred: " + e.getMessage());
            e.printStackTrace(); // Print the stack trace for more context
            return ResponseEntity.status(500).body(null);
        }
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteEnrollment(
        @RequestParam Long studentId, 
        @RequestParam Long courseId) {
       System.out.println(studentId);
       System.out.println(courseId);
        try {
            // Call service to delete the enrollment
            enrollmentService.deleteEnrollmentByStudentAndCourse(studentId, courseId);
            return ResponseEntity.ok("Enrollment deleted successfully.");
        } catch (Exception e) {
            // If an error occurs, return a 500 status with the error message
            return ResponseEntity.status(500).body("Failed to delete enrollment: " + e.getMessage());
        }
    }
    @GetMapping("/enrolled-courses")
    public List<Long> getEnrolledStudents(@RequestParam Long courseId) {
        return enrollmentService.getStudentIdsByCourseId(courseId);
    }
}