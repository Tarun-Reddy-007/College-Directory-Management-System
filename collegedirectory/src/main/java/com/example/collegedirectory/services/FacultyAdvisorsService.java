package com.example.collegedirectory.services;

import com.example.collegedirectory.entities.FacultyAdvisors;
import com.example.collegedirectory.entities.User;
import com.example.collegedirectory.repositories.FacultyAdvisorsRepository;
import com.example.collegedirectory.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class FacultyAdvisorsService {

    @Autowired
    private FacultyAdvisorsRepository facultyAdvisorsRepository;

    @Autowired
    private UserRepository userRepository;

    public boolean addFacultyAdvisor(Long studentId, Long facultyId) {
        Optional<User> studentOpt = userRepository.findById(studentId);
        Optional<User> facultyOpt = userRepository.findById(facultyId);

        if (studentOpt.isPresent() && facultyOpt.isPresent()) {
            User student = studentOpt.get();
            User faculty = facultyOpt.get();

            if (facultyAdvisorsRepository.findByStudent(student) != null) {
                return false; 
            }

            FacultyAdvisors facultyAdvisors = new FacultyAdvisors();
            facultyAdvisors.setStudent(student);
            facultyAdvisors.setFaculty(faculty);

            facultyAdvisorsRepository.save(facultyAdvisors);
            return true; 
        }
        return false; 
    }

    public boolean deleteFacultyAdvisor(Long studentId) {
        Optional<User> studentOpt = userRepository.findById(studentId);
        if (studentOpt.isPresent()) {
            User student = studentOpt.get();
            FacultyAdvisors facultyAdvisor = facultyAdvisorsRepository.findByStudent(student);
            if (facultyAdvisor != null) {
                facultyAdvisorsRepository.delete(facultyAdvisor);
                return true; 
            }
        }
        return false; 
    }

    public Map<String, Object> getFacultyAdvisorDetails(Long studentId) {
        User student = userRepository.findById(studentId).orElse(null);
        if (student == null) {
            return null; 
        }

        FacultyAdvisors facultyAdvisor = facultyAdvisorsRepository.findByStudent(student);
        if (facultyAdvisor == null) {
            return null; 
        }

        User faculty = facultyAdvisor.getFaculty();
        String departmentId = String.valueOf(faculty.getFacultyProfile().getDepartment().getId());

        String officeHours = faculty.getOfficeHours();
        String departmentName = faculty.getFacultyProfile().getDepartment().getName();

        Map<String, Object> facultyDetails = new HashMap<>();
        facultyDetails.put("facultyId", faculty.getId());
        facultyDetails.put("name", faculty.getName());
        facultyDetails.put("email", faculty.getEmail());
        facultyDetails.put("phone", faculty.getPhone());
        facultyDetails.put("officeHours", officeHours);
        facultyDetails.put("departmentName", departmentName);

        return facultyDetails; 
    }

}
