package com.example.collegedirectory.controllers;

import com.example.collegedirectory.repositories.FacultyAdvisorsRepository;
import com.example.collegedirectory.repositories.StudentProfileRepository;
import com.example.collegedirectory.services.GraphService;
import com.example.collegedirectory.services.StudentProfileService;
import com.example.collegedirectory.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/graphs")
public class GraphController {

    private final GraphService graphService;
    private final StudentProfileRepository studentProfileRepository;
    private final StudentProfileService studentProfileService;
    @Autowired
    private FacultyAdvisorsRepository facultyAdvisorsRepository;

    @Autowired
    public GraphController(GraphService graphService, 
                           StudentProfileRepository studentProfileRepository, 
                           StudentProfileService studentProfileService) {
        this.graphService = graphService;
        this.studentProfileRepository = studentProfileRepository;
        this.studentProfileService = studentProfileService;
    }

    @GetMapping("/enrollment-trends")
    public Map<String, Integer> getEnrollmentTrends() {
        return graphService.getEnrollmentTrends();
    }

    @GetMapping("/faculty-course-loads")
    public Map<String, Integer> getFacultyCourseLoads() {
        return graphService.getFacultyCourseLoads();
    }

    @GetMapping("/students-per-department")
    public Map<String, Long> getStudentsPerDepartment() {
        List<Object[]> result = studentProfileRepository.countStudentsByDepartment();
        Map<String, Long> departmentStudentCount = new HashMap<>();

        for (Object[] row : result) {
            String departmentName = (String) row[0];
            Long studentCount = (Long) row[1];
            departmentStudentCount.put(departmentName, studentCount);
        }

        return departmentStudentCount;
    }

    @GetMapping("/students-count-by-year")
    public ResponseEntity<Map<String, Long>> getStudentCountByYear() {
        try {
            Map<String, Long> studentCount = studentProfileService.getStudentCountByYear();
            return ResponseEntity.ok(studentCount);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Long> errorResponse = new HashMap<>();
            errorResponse.put("error", -1L); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
        
    }
    @GetMapping("/faculty-advisor-workload")
    public List<Map<String, Object>> getFacultyAdvisorWorkload() {
        List<Map<String, Object>> workload = facultyAdvisorsRepository.findFacultyAdvisorWorkload();

        return workload;
    }
    @Autowired
    private UserService userService;
    
    @GetMapping("/students-to-faculty")
    public double getStudentFacultyRatio() {
        return graphService.getStudentFacultyRatio();
    }
    
}

