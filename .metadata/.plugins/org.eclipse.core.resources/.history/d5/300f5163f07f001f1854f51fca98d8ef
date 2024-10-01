package com.example.collegedirectory.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.collegedirectory.entities.Course;
import com.example.collegedirectory.entities.Department;
import com.example.collegedirectory.services.CourseService;
import com.example.collegedirectory.services.DepartmentService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    @Autowired
    private CourseService courseService;
    @Autowired
    private DepartmentService departmentService;

    @GetMapping("/getallcourses")
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    @PostMapping("/addcourse")
    public ResponseEntity<String> addCourse(@RequestBody Map<String, Object> courseData) {
        String title = (String) courseData.get("title");
        String description = (String) courseData.get("description");
        Long facultyId = Long.valueOf(courseData.get("faculty").toString()); // Faculty ID received
        String departmentName = (String) courseData.get("department"); // Department name received
        // Call service to handle adding the course
        courseService.addCourse(title, description, facultyId, departmentName);
        
        return ResponseEntity.ok("Course added successfully");
    }
    
    @PutMapping("/updatecourse/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Map<String, Object> courseData) {
        System.out.println(courseData); // Print the incoming data to verify
        
        // Call the service to update the course
        Course updatedCourse = courseService.updateCourse(id, courseData);

        if (updatedCourse != null) {
            return ResponseEntity.ok(updatedCourse);
        }

        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/deletecourse/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        boolean isDeleted = courseService.deleteCourse(id);

        if (isDeleted) {
            return ResponseEntity.noContent().build(); // Return 204 No Content if successfully deleted
        } else {
            return ResponseEntity.notFound().build(); // Return 404 Not Found if the course does not exist
        }
    }
    @GetMapping("/faculty/{facultyId}")
    public List<Course> getCoursesByFaculty(@PathVariable Long facultyId) {
        return courseService.getCoursesByFacultyId(facultyId);
    }
}
