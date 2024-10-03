package com.example.collegedirectory.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.collegedirectory.entities.Department; 
import com.example.collegedirectory.entities.FacultyProfile;
import com.example.collegedirectory.entities.StudentProfile; 
import com.example.collegedirectory.entities.Role;
import com.example.collegedirectory.entities.User;
import com.example.collegedirectory.repositories.UserRepository;
import com.example.collegedirectory.repositories.DepartmentRepository;
import com.example.collegedirectory.repositories.StudentProfileRepository;
import com.example.collegedirectory.repositories.FacultyProfileRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository; 

    @Autowired
    private StudentProfileRepository studentProfileRepository; 
    
    @Autowired
    private FacultyProfileRepository facultyProfileRepository; 

    public User authenticate(String username, String password, String role) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            try {
                Role providedRole = Role.valueOf(role.trim().toUpperCase()); 
                if (user.getPassword().equals(password) && user.getRole() == providedRole) {
                    return user; 
                }
            } catch (IllegalArgumentException e) {
            }
        }
        return null;
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    public User save(User user) {
        return userRepository.save(user);
    }
    
    public User addStudent(User user, String departmentName, String year) {
        user.setRole(Role.STUDENT);
        User savedUser = userRepository.save(user); 

        Department department = departmentRepository.findByName(departmentName);
        System.out.println("Department found: " + department);

        if (department == null) {
            throw new IllegalArgumentException("Department not found");
        }

        StudentProfile studentProfile = new StudentProfile();
        studentProfile.setUser(savedUser); 
        studentProfile.setDepartment(department); 
        studentProfile.setYear(year); 

        studentProfileRepository.save(studentProfile);

        return savedUser; 
    }

    
    public User addFaculty(User user, String departmentName, String officeHours) {
        user.setRole(Role.FACULTY_MEMBER); 
        
        User savedUser = userRepository.save(user);

        Department department = departmentRepository.findByName(departmentName);
        if (department == null) {
            throw new IllegalArgumentException("Department not found");
        }
        
        FacultyProfile facultyProfile = new FacultyProfile();
        facultyProfile.setUser(savedUser);  
        facultyProfile.setDepartment(department);
        facultyProfile.setOfficeHours(officeHours);

        facultyProfileRepository.save(facultyProfile);

        return savedUser;
    }




    public List<User> findAllStudents() {
        return userRepository.findAllByRole(Role.STUDENT);
    }

    
    public List<User> findAllFaculties() {
        return userRepository.findAllByRole(Role.FACULTY_MEMBER);
    }
    
    public User updateStudent(Long id, User updatedUser, String departmentName, Object yearObj) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser != null) {
            existingUser.setName(updatedUser.getName());
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPhone(updatedUser.getPhone());
            existingUser.setPassword(updatedUser.getPassword());

            StudentProfile studentProfile = studentProfileRepository.findByUser(existingUser);
            if (studentProfile != null) {
                Department department = departmentRepository.findByName(departmentName);
                if (department != null) {
                    studentProfile.setDepartment(department);
                }

                String year;
                if (yearObj instanceof Integer) {
                    year = String.valueOf(yearObj); 
                } else if (yearObj instanceof String) {
                    year = (String) yearObj; 
                } else {
                    throw new IllegalArgumentException("Year must be a String or Integer");
                }
                studentProfile.setYear(year); 

                studentProfileRepository.save(studentProfile); 
            }

            return userRepository.save(existingUser);
        }
        return null; 
    }

    public User updateFaculty(Long id, User updatedUser, String departmentName, String officeHours) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser != null) {
            existingUser.setName(updatedUser.getName());
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPhone(updatedUser.getPhone());
            existingUser.setPassword(updatedUser.getPassword()); 
            FacultyProfile facultyProfile = facultyProfileRepository.findByUser(existingUser);
            if (facultyProfile != null) {
                Department department = departmentRepository.findByName(departmentName);
                if (department != null) {
                    facultyProfile.setDepartment(department);
                }
                facultyProfile.setOfficeHours(officeHours); 

                facultyProfileRepository.save(facultyProfile); 
            }

            return userRepository.save(existingUser); 
        }
        return null;
    }
    
    public List<Map<String, Object>> getAllFacultyDetails() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> facultyDetails = new ArrayList<>();

        for (User user : users) {
            if (user.getFacultyProfile() != null) { 
                Map<String, Object> facultyData = new HashMap<>();
                facultyData.put("id", user.getId());
                facultyData.put("name", user.getName());
                facultyData.put("username", user.getUsername());
                facultyData.put("phone", user.getPhone());
                facultyData.put("email", user.getEmail());
                facultyData.put("officeHours", user.getOfficeHours());
                facultyData.put("departmentName", user.getDepartment());

                facultyDetails.add(facultyData);
            }
        }

        return facultyDetails;
    }


    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false; 
    }
}
