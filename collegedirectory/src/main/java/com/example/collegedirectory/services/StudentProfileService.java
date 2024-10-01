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
        // Retrieve student profile by userId
        StudentProfile studentProfile = studentProfileRepository.findByUserId(userId);
        if (studentProfile == null) {
            throw new RuntimeException("Student not found.");
        }
        System.out.println("Student: " + studentProfile);

        // Retrieve the department from the student profile
        Department department = studentProfile.getDepartment();
        if (department == null) {
            throw new RuntimeException("Department not found.");
        }
        System.out.println("Department: " + department);

        // Prepare response data
        Map<String, Object> academicDetails = new HashMap<>();
        academicDetails.put("year", studentProfile.getYear());
        academicDetails.put("department", department.getName());

        return academicDetails;
    }

    public List<Map<String, String>> getEnrolledCourses(Long userId) {
        // Retrieve student profile by userId
        StudentProfile studentProfile = studentProfileRepository.findByUserId(userId);
        if (studentProfile == null) {
            throw new RuntimeException("Student not found.");
        }

        // Retrieve all enrollments for the student
        List<Enrollment> enrollments = enrollmentRepository.findByStudent(studentProfile);
        
        // Fetch course details
        return enrollments.stream()
                .map(enrollment -> {
                    Course course = enrollment.getCourse();
                    // Use HashMap to clarify the return type
                    Map<String, String> courseDetails = new HashMap<>();
                    courseDetails.put("title", course.getTitle());
                    courseDetails.put("description", course.getDescription());
                    return courseDetails;
                })
                .collect(Collectors.toList());
    }

    public List<Object[]> getStudentDetailsByFacultyId(Long facultyId) {
        // Step 1: Retrieve all courses taught by the faculty
        List<Course> courses = courseRepository.findByFacultyId(facultyId);
        List<Long> courseIds = new ArrayList<>();
        Set<String> courseTitles = new HashSet<>();

        for (Course course : courses) {
            courseIds.add(course.getId());
        }

        // Step 2: Retrieve all enrollments for these courses
        List<Enrollment> enrollments = enrollmentRepository.findByCourseIdIn(courseIds);
        List<Long> studentIds = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            studentIds.add(enrollment.getStudent().getUserId());
        }

        // Step 3: Retrieve user details for the students
        List<User> students = UserRepository.findByIdIn(studentIds); // Call the method on the injected instance
        List<Object[]> studentDetails = new ArrayList<>();

        for (User student : students) {
            // Returning the required fields as an Object array
            studentDetails.add(new Object[]{
            	student.getId(),
                student.getName(),
                student.getPhone(),
                student.getEmail(),
                student.getYear(),
                // Concatenate course titles
            });
        }
        return studentDetails;
    }
    public Map<String, Long> getStudentCountByYear() {
        try {
            // Step 1: Retrieve all student profiles
            List<StudentProfile> studentProfiles = studentProfileRepository.findAll();
            if (studentProfiles == null) {
                throw new RuntimeException("No student profiles found");
            }
            // Log the count of student profiles
            System.out.println("Retrieved " + studentProfiles.size() + " student profiles");

            // Step 2: Count the number of students per year
            Map<String, Long> studentCountByYear = studentProfiles.stream()
                .collect(Collectors.groupingBy(StudentProfile::getYear, Collectors.counting()));

            return studentCountByYear;
        } catch (Exception e) {
            // Log the error
            e.printStackTrace();
            throw e; // Rethrow the exception to be handled by the controller
        }
    }

}
