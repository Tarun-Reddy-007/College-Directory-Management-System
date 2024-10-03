package com.example.collegedirectory.services;

import com.example.collegedirectory.entities.Course;
import com.example.collegedirectory.entities.Department;
import com.example.collegedirectory.entities.Enrollment;
import com.example.collegedirectory.entities.StudentProfile;
import com.example.collegedirectory.entities.User;
import com.example.collegedirectory.repositories.CourseRepository;
import com.example.collegedirectory.repositories.DepartmentRepository;
import com.example.collegedirectory.repositories.EnrollmentRepository;
import com.example.collegedirectory.repositories.StudentProfileRepository;
import com.example.collegedirectory.repositories.UserRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentProfileService {

    @Autowired
    private StudentProfileRepository studentProfileRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository; // Add this
    
    @Autowired
    private CourseRepository courseRepository;
    
    public StudentProfile findById(Long id) {
        return studentProfileRepository.findById(id).orElse(null); // Return null if not found
    }
    
    @Autowired
    private UserRepository UserRepository;
    
    public Map<String, Object> getStudentAcademicDetails(Long userId) {
        StudentProfile studentProfile = studentProfileRepository.findByUserId(userId);
        if (studentProfile == null) {
            throw new RuntimeException("Student not found.");
        }

        Department department = studentProfile.getDepartment();
        if (department == null) {
            throw new RuntimeException("Department not found.");
        }

        Map<String, Object> academicDetails = new HashMap<>();
        academicDetails.put("year", studentProfile.getYear());
        academicDetails.put("department", department.getName());

        return academicDetails;
    }

    public List<Map<String, String>> getEnrolledCourses(Long userId) {
        StudentProfile studentProfile = studentProfileRepository.findByUserId(userId);
        if (studentProfile == null) {
            throw new RuntimeException("Student not found.");
        }

        List<Enrollment> enrollments = enrollmentRepository.findByStudent(studentProfile);

        return enrollments.stream()
                .map(enrollment -> {
                    Course course = enrollment.getCourse();
                    Map<String, String> courseDetails = new HashMap<>();
                    courseDetails.put("title", course.getTitle());
                    courseDetails.put("description", course.getDescription());
                    return courseDetails;
                })
                .collect(Collectors.toList());
    }

    public List<Object[]> getStudentDetailsByFacultyId(Long facultyId) {
        List<Course> courses = courseRepository.findByFacultyId(facultyId);
        List<Long> courseIds = new ArrayList<>();
        Set<String> courseTitles = new HashSet<>();

        for (Course course : courses) {
            courseIds.add(course.getId());
        }

        List<Enrollment> enrollments = enrollmentRepository.findByCourseIdIn(courseIds);
        List<Long> studentIds = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            studentIds.add(enrollment.getStudent().getUserId());
        }

        List<User> students = UserRepository.findByIdIn(studentIds); // Call the method on the injected instance
        List<Object[]> studentDetails = new ArrayList<>();

        for (User student : students) {
            studentDetails.add(new Object[]{
            	student.getId(),
                student.getName(),
                student.getPhone(),
                student.getEmail(),
                student.getYear(),
            });
        }
        return studentDetails;
    }
    
    public Map<String, Long> getStudentCountByYear() {
        try {
            List<StudentProfile> studentProfiles = studentProfileRepository.findAll();
            if (studentProfiles == null) {
                throw new RuntimeException("No student profiles found");
            }
            System.out.println("Retrieved " + studentProfiles.size() + " student profiles");

            Map<String, Long> studentCountByYear = studentProfiles.stream()
                .collect(Collectors.groupingBy(StudentProfile::getYear, Collectors.counting()));

            return studentCountByYear;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

}
