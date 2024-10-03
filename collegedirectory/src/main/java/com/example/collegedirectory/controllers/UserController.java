package com.example.collegedirectory.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.collegedirectory.entities.Role;
import com.example.collegedirectory.entities.User;
import com.example.collegedirectory.repositories.DepartmentRepository;
import com.example.collegedirectory.repositories.StudentProfileRepository;
import com.example.collegedirectory.repositories.UserRepository;
import com.example.collegedirectory.services.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        String role = credentials.get("role");
        
        User user = userService.authenticate(username, password, role); 
        
        if (user != null) {

            return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "userId", user.getId() 
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid username, password, or role"));
        }
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserDetailsByUsername(@PathVariable String username) {
        User user = userService.findByUsername(username);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/getid/{id}")
    public ResponseEntity<User> getUserDetailsById(@PathVariable Long id) {
        User user = userService.findById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PutMapping("/updateid/{id}")
    public ResponseEntity<User> updateUserDetails(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userService.findById(id);
        if (user != null) {
            user.setUsername(updatedUser.getUsername());
            user.setEmail(updatedUser.getEmail());
            user.setRole(updatedUser.getRole());
            userService.save(user); 
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/addstudent")
    public ResponseEntity<User> addStudent(@RequestBody Map<String, Object> request) {
        try {
            User newUser = new User();
            newUser.setUsername((String) request.get("username"));
            newUser.setPassword((String) request.get("password"));
            newUser.setName((String) request.get("name"));
            newUser.setEmail((String) request.get("email"));
            newUser.setPhone((String) request.get("phone"));

            String departmentName = (String) request.get("department");

            Object yearObj = request.get("year");
            String year;
            if (yearObj instanceof Integer) {
                year = String.valueOf(yearObj); 
            } else if (yearObj instanceof String) {
                year = (String) yearObj; 
            } else {
                throw new IllegalArgumentException("Year must be a String or Integer");
            }

            User savedUser = userService.addStudent(newUser, departmentName, year);
            return ResponseEntity.status(201).body(savedUser);
        } catch (IllegalArgumentException e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.status(400).body(null); 
        } catch (Exception e) {
            System.err.println("Error in addStudent: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null); 
        }
    }

    @GetMapping("/getallstudents")
    public ResponseEntity<List<User>> getAllStudents() {
        List<User> students = userService.findAllStudents();
        return ResponseEntity.ok(students);  
    }
    
    @PutMapping("/updatestudent/{id}")
    public ResponseEntity<User> updateStudent(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            User updatedUser = new User();
            updatedUser.setName((String) request.get("name"));
            updatedUser.setUsername((String) request.get("username"));
            updatedUser.setEmail((String) request.get("email"));
            updatedUser.setPhone((String) request.get("phone"));
            updatedUser.setPassword((String) request.get("password")); 

            String departmentName = (String) request.get("department");

            Object yearObj = request.get("year");

            User user = userService.updateStudent(id, updatedUser, departmentName, yearObj);
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.status(400).body(null); 
        } catch (Exception e) {
            System.err.println("Error in updateStudent: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null); 
        }
    }

    @DeleteMapping("/deletestudent/{id}")
    public ResponseEntity<Map<String, String>> deleteStudent(@PathVariable Long id) {
        boolean isDeleted = userService.deleteUser(id);
        if (isDeleted) {
            return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/addfaculty")
    public ResponseEntity<User> addFaculty(@RequestBody Map<String, Object> request) {
    	System.out.println(request);        
    	try {
            User newUser = new User();
            newUser.setUsername((String) request.get("username"));
            newUser.setPassword((String) request.get("password"));
            newUser.setName((String) request.get("name"));
            newUser.setEmail((String) request.get("email"));
            newUser.setPhone((String) request.get("phone"));

            String departmentName = (String) request.get("department");

            String officeHours = (String) request.get("officeHours");
            if (officeHours == null || officeHours.isEmpty()) {
                throw new IllegalArgumentException("Office Hours must not be empty");
            }

            User savedUser = userService.addFaculty(newUser, departmentName, officeHours);
            return ResponseEntity.status(201).body(savedUser);
        } catch (IllegalArgumentException e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.status(400).body(null);
        } catch (Exception e) {
            System.err.println("Error in addFaculty: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null); 
        }
    }
    
    @PutMapping("/updatefaculty/{id}")
    public ResponseEntity<User> updateFaculty(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            User updatedUser = new User();
            updatedUser.setName((String) request.get("name"));
            updatedUser.setUsername((String) request.get("username"));
            updatedUser.setEmail((String) request.get("email"));
            updatedUser.setPhone((String) request.get("phone"));
            updatedUser.setPassword((String) request.get("password")); 
            String departmentName = (String) request.get("department");
            String officeHours = (String) request.get("officeHours");
            if (officeHours == null || officeHours.isEmpty()) {
                throw new IllegalArgumentException("Office Hours must not be empty");
            }

            User user = userService.updateFaculty(id, updatedUser, departmentName, officeHours);
            if (user != null) {
                return ResponseEntity.ok(user);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            System.err.println("Error: " + e.getMessage());
            return ResponseEntity.status(400).body(null); 
        } catch (Exception e) {
            System.err.println("Error in updateFaculty: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
    
    @GetMapping("/getallfaculties")
    public List<Map<String, Object>> getAllPresentFaculties() {
        return userService.getAllFacultyDetails();
    }
    
    @DeleteMapping("/deletefaculty/{id}")
    public ResponseEntity<Map<String, String>> deleteFaculty(@PathVariable Long id) {
        boolean isDeleted = userService.deleteUser(id);
        if (isDeleted) {
            return ResponseEntity.ok(Map.of("message", "Faculty deleted successfully"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
