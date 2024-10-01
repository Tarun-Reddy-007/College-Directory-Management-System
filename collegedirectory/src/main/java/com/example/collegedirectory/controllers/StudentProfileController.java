package com.example.collegedirectory.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.collegedirectory.services.StudentProfileService;

@RestController
@RequestMapping("/api/student")
public class StudentProfileController {

    @Autowired
    private StudentProfileService studentProfileService;

    @GetMapping("/dept-year")
    public ResponseEntity<Map<String, Object>> getStudentAcademics(@RequestParam Long userId) {
        try {
            // Fetch academic details using the service
            Map<String, Object> academicDetails = studentProfileService.getStudentAcademicDetails(userId);
            return ResponseEntity.ok(academicDetails);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
    @GetMapping("/enrolled-courses")
    public ResponseEntity<List<Map<String, String>>> getEnrolledCourses(@RequestParam Long userId) {
        try {
            List<Map<String, String>> courses = studentProfileService.getEnrolledCourses(userId);
            return ResponseEntity.ok(courses);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @GetMapping("/faculty/{facultyId}")
    public List<Object[]> getStudentDetailsByFacultyId(@PathVariable Long facultyId) {
        return studentProfileService.getStudentDetailsByFacultyId(facultyId);
    }
    
}
