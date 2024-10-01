package com.example.collegedirectory.controllers;

import com.example.collegedirectory.services.FacultyAdvisorsService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/facultyAdvisors")
public class FacultyAdvisorsController {

    @Autowired
    private FacultyAdvisorsService facultyAdvisorsService;

    @PostMapping("/addfacultyadvisor")
    public String addFacultyAdvisor(@RequestBody FacultyAdvisorRequest request) {
        boolean isAdded = facultyAdvisorsService.addFacultyAdvisor(request.getStudentId(), request.getFacultyId());
        return isAdded ? "Faculty advisor added successfully" : "Student already has a faculty advisor"; // Return success message
    }

    public static class FacultyAdvisorRequest {
        private Long studentId;
        private Long facultyId;

        public Long getStudentId() {
            return studentId;
        }

        public void setStudentId(Long studentId) {
            this.studentId = studentId;
        }

        public Long getFacultyId() {
            return facultyId;
        }

        public void setFacultyId(Long facultyId) {
            this.facultyId = facultyId;
        }
    }
    @DeleteMapping("/deletefacultyadvisor/{studentId}")
    public String deleteFacultyAdvisor(@PathVariable Long studentId) {
        boolean isDeleted = facultyAdvisorsService.deleteFacultyAdvisor(studentId);
        return isDeleted ? "Faculty advisor deleted successfully" : "No faculty advisor found for this student"; // Return appropriate message
    }
    @GetMapping("/{studentId}")
    public Map<String, Object> getFacultyAdvisor(@PathVariable Long studentId) {
        return facultyAdvisorsService.getFacultyAdvisorDetails(studentId);
    }
}
