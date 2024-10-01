package com.example.collegedirectory.repositories;

import com.example.collegedirectory.entities.FacultyAdvisors;
import com.example.collegedirectory.entities.User;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FacultyAdvisorsRepository extends JpaRepository<FacultyAdvisors, Long> {
    FacultyAdvisors findByStudent(User student);
    @Query("SELECT u.name AS facultyName, COUNT(f.student) AS studentCount " +
    	       "FROM FacultyAdvisors f " +
    	       "JOIN User u ON f.faculty.id = u.id " +
    	       "GROUP BY u.name")
    	List<Map<String, Object>> findFacultyAdvisorWorkload();
}
