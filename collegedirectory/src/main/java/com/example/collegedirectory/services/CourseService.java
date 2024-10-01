package com.example.collegedirectory.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.collegedirectory.entities.Course;
import com.example.collegedirectory.entities.Department;
import com.example.collegedirectory.entities.User;
import com.example.collegedirectory.repositories.CourseRepository;
import com.example.collegedirectory.repositories.DepartmentRepository;
import com.example.collegedirectory.repositories.UserRepository;

import java.util.List;
import java.util.Map;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Course> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        
        for (Course course : courses) {
            User faculty = userRepository.findById(course.getFacultyId()).orElse(null); 
            if (faculty != null) {
                course.setFacultyName(faculty.getName());
            }

            if (course.getDepartment() != null) {
                course.setDepartmentName(course.getDepartment().getName()); 
            }
        }
        
        return courses;
    }

    public Course addCourse(String title, String description, Long facultyId, String departmentName) {
        System.out.println("Department Name Received: " + departmentName); 

        Department department = departmentRepository.findByName(departmentName);
        if (department == null) {
            throw new IllegalArgumentException("Department not found: " + departmentName);
        }

        Course course = new Course();
        course.setTitle(title);
        course.setDescription(description);
        course.setDepartment(department); 
        course.setFacultyId(facultyId); 

        return courseRepository.save(course);
    }
    
    public Course updateCourse(Long id, Map<String, Object> courseData) {
        Course existingCourse = courseRepository.findById(id).orElse(null);

        if (existingCourse != null) {
            String title = (String) courseData.get("title");
            String description = (String) courseData.get("description");
            String departmentName = (String) courseData.get("department");
            Long facultyId = Long.valueOf(courseData.get("faculty").toString());

            Department department = departmentRepository.findByName(departmentName);

            if (department == null) {
                throw new IllegalArgumentException("Department not found with name: " + departmentName);
            }

            existingCourse.setTitle(title);
            existingCourse.setDescription(description);
            existingCourse.setDepartment(department); 
            existingCourse.setFacultyId(facultyId);

            return courseRepository.save(existingCourse);
        }

        return null; 
    }
    
    public boolean deleteCourse(Long id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
            return true;
        } else {
            return false; 
        }
    }
    
    public Course findById(Long id) {
        return courseRepository.findById(id).orElse(null); 
    }
    
    public List<Course> getCoursesByFacultyId(Long facultyId) {
        return courseRepository.findByFacultyId(facultyId);
    }
    
    public void save(Course course) {
        courseRepository.save(course); 
    }
}
