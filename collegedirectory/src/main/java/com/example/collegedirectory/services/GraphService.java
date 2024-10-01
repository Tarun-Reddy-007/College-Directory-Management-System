package com.example.collegedirectory.services;

import com.example.collegedirectory.entities.Course;
import com.example.collegedirectory.entities.Enrollment;
import com.example.collegedirectory.entities.StudentProfile;
import com.example.collegedirectory.entities.User;
import com.example.collegedirectory.repositories.CourseRepository;
import com.example.collegedirectory.repositories.EnrollmentRepository;
import com.example.collegedirectory.repositories.StudentProfileRepository;
import com.example.collegedirectory.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GraphService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;
    
    @Autowired
    private UserRepository userRepository;

    // Fetch enrollment trends
    public Map<String, Integer> getEnrollmentTrends() {
        Map<String, Integer> trends = new HashMap<>();
        List<Enrollment> enrollments = enrollmentRepository.findAll();
        
        // Assume enrollment year is derived from StudentProfile.year (modify as necessary)
        for (Enrollment enrollment : enrollments) {
            StudentProfile student = enrollment.getStudent();
            String year = student.getYear();

            trends.put(year, trends.getOrDefault(year, 0) + 1);
        }
        
        return trends;
    }

    // Fetch faculty course loads
    public Map<String, Integer> getFacultyCourseLoads() {
        Map<String, Integer> courseLoads = new HashMap<>();
        List<Course> courses = courseRepository.findAll();

        for (Course course : courses) {
            Long facultyId = course.getFacultyId();
            
			// Fetch the faculty name using the facultyId
            User faculty = userRepository.findById(facultyId).orElse(null);
            String facultyName = (faculty != null) ? faculty.getName() : "Unknown Faculty";
            
            courseLoads.put(facultyName, courseLoads.getOrDefault(facultyName, 0) + 1);
        }

        return courseLoads;
    }

}
